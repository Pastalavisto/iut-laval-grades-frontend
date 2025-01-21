import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/AuthProvider';
import { Student } from '@/types/student';
import { ArrowDownTrayIcon, PlusIcon } from '@heroicons/react/16/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import GradesList from './GradesList';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { gradeAddFormSchema } from './AddGradeForm';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import AddGradeForm from './AddGradeForm';
import { Grade } from '@/types/grade';
import { Course } from '@/types/course';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function StudentPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const user = useAuth();
  const [studentGrades, setStudentsGrades] = useState<Grade[] | []>([]);
  const [gradeToEdit, setGradeToEdit] = useState<Grade | undefined>(undefined);
  const [studentInfos, setStudentInfos] = useState<Student | undefined>(undefined);
  const [courses, setCourses] = useState<Course[] | []>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchYears() {
    await axios
      .get(API_URL + '/grades/years', {
        headers: {
          Authorization: `Bearer ${user?.user?.token}`
        }
      })
      .then((res) => {
        setYears(res.data);
        setSelectedYear(res.data[0]);
      })
      .catch((err) => {
        if (err.status === 500) {
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la récupération des années.'
          });
        }
      });
  }

  // Either POST or PUT (add a grade, or edit a grade)
  async function onGradeFormSubmit(values: z.infer<typeof gradeAddFormSchema>) {
    console.log(JSON.stringify(values))
    if (values.gradeId) {
      await axios
        .put(
          API_URL + '/grades/' + values.gradeId,
          {
            grade: values.grade
          },
          { headers: { Authorization: `Bearer ${user?.user?.token}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: 'Note modifiée',
              description: 'La note a été modifiée avec succès.'
            });
            setOpenDialog(false);
            setGradeToEdit(undefined);
            setStudentsGrades((prevGrades) =>
              prevGrades.map((grade) =>
                grade.id === values.gradeId
                  ? { ...grade, grade: values.grade } // Mise à jour de la note
                  : grade
              )
            );
          }
        }).catch((e) => {
          if (e.status === 401) {
            toast({
              title: 'Erreur',
              description: 'Vous n’êtes pas autorisé à effectuer cette action.'
            });
            user?.logOut();
            if (e.status === 500) {
              toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la modification de la note.'
              });
            }
          }
        })
    } else {
      const curCourse = courses.find((c) => c.id === parseInt(values.courseId));
      await axios
        .post(
          API_URL + '/grades',
          {
            ...values,
            courseId: parseInt(values.courseId)
          },
          { headers: { Authorization: `Bearer ${user?.user?.token}` } }
        )
        .then((res) => {
          if (res.status === 201) {
            toast({
              title: 'Note ajoutée',
              description: 'La note a été ajoutée avec succès.'
            });
            setStudentsGrades([
              ...studentGrades,
              {
                ...values,
                courseName: curCourse?.name || 'N/A',
                courseId: curCourse?.id?.toString() || '', // Conversion en string
                id: res.data.id,
                courseCode: curCourse?.code || 'N/A',
                credits: curCourse?.credits || 0
              }
            ]);
            setOpenDialog(false);
          }
        }).catch((e) => {
          if (e.status === 401) {
            toast({
              title: 'Erreur',
              description: 'Vous n’êtes pas autorisé à effectuer cette action.'
            });
            user?.logOut();
            if (e.status === 500) {
              toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de l’ajout de la note.'
              });
            }
          }
        })


    }
  }

  // Either fetches student infos or grades
  const fetchStudent = (route: string) => {
    return axios
      .get(API_URL + `${route}/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.user?.token}`
        }
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  // Fetches the PDF transcript file
  const fetchTranscript = async () => {
    if (!selectedYear) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner une année.'
      });
      return;
    }
    await axios
      .get(API_URL + `/grades/student/${id}/transcript`, {
        responseType: 'blob',
        params: { academicYear: selectedYear },
        headers: {
          Authorization: `Bearer ${user?.user?.token}`
        }
      })
      .then((res) => {
        window.open(URL.createObjectURL(res.data));
      })
      .catch((err) => {
        if (err.status === 404) {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Aucune note n’a été trouvée pour cet étudiant.'
          });
        }
      });
  };

  async function fetchCourses() {
    axios
      .get(API_URL + '/courses', { headers: { Authorization: `Bearer ${user?.user?.token}` } })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setCourses(res.data);
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          toast({
            title: 'Erreur',
            description: 'Vous n’êtes pas autorisé à effectuer cette action.'
          });
          user?.logOut();
        } else if (err.status === 500) {
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la récupération des cours.'
          });
        }
      });
  }

  async function handleGradeDeletion(gradeId: number) {
    axios
      .delete(API_URL + `/grades/${gradeId}`, { headers: { Authorization: `Bearer ${user?.user?.token}` } })
      .then((res) => {
        if (res.status === 204) {
          setStudentsGrades(studentGrades.filter((grade) => grade.id !== gradeId));
          toast({
            title: 'Note supprimée',
            description: 'La note a été supprimée avec succès.'
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast({
            title: 'Erreur',
            description: 'Vous n’êtes pas autorisé à effectuer cette action.'
          });
          user?.logOut();
        }
      });
  }

  // Opening the dialog again to edit a grade
  async function editGrade(grade: Grade) {
    setOpenDialog(true);
    setGradeToEdit(grade);
  }

  useEffect(() => {
    async function fetchPageData() {
      await fetchStudent('/grades/student')
        .then((res) => setStudentsGrades(res))
        .catch((err) => console.log(err));
      await fetchStudent('/students')
        .then((res) => setStudentInfos(res))
        .catch((err) => console.log(err));
      await fetchCourses();
      await fetchYears();

      setIsLoading(false);
    }

    fetchPageData();
  }, []);

  // Remove grade to edit on dialog close
  useEffect(() => {
    if (!openDialog) setGradeToEdit(undefined);
  }, [openDialog])

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-8 items-baseline">
          <h1 className="text-xl font-bold text-gray-800">
            {studentInfos ? studentInfos.firstName : 'Chargement ...'}
          </h1>
          <h2 className="text-sm text-gray-500">
            Numéro étudiant : {studentInfos ? studentInfos.studentId : 'Chargement ...'}
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant={'outline'} onClick={fetchTranscript}>
            <ArrowDownTrayIcon />
            Relevé de notes
          </Button>
          <Button variant="outline" onClick={() => setOpenDialog(!openDialog)}>
            <PlusIcon />
            Ajouter une note
          </Button>
        </div>
      </div>

      <div className="grid gap-4 mb-10">
        <h3 className="grid grid-cols-[200px_1fr] items-center">
          <span className="font-bold">Email</span>
          <span>{studentInfos ? studentInfos.email : 'Chargement...'}</span>
        </h3>
        <h3 className="grid grid-cols-[200px_1fr] items-center">
          <span className="font-bold">Date de naissance</span>
          <span>{studentInfos ? studentInfos.dateOfBirth : 'Chargement...'}</span>
        </h3>
        <Select
          value={selectedYear}
          onValueChange={(value) => {
            setSelectedYear(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une année" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Année</SelectLabel>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>{gradeToEdit ? "Modifier une note" : "Ajouter une note"}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {studentInfos && <AddGradeForm onSubmit={onGradeFormSubmit} id={studentInfos.id} courses={courses} gradeToEdit={gradeToEdit} />}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <GradesList isLoading={isLoading} grades={studentGrades} year={selectedYear} onDeleteGrade={handleGradeDeletion} onEditGrade={editGrade} />
    </>
  );
}
