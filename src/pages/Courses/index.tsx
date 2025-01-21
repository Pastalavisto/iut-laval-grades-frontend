import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/types/course';
import { DialogDescription } from '@radix-ui/react-dialog';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import AddCourseForm, { courseAddformSchema } from './AddCourseForm';
import CoursesTableList from './CoursesTableList';

export default function Courses() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | undefined>(undefined);

  const user = useAuth();
  const { toast } = useToast();

  //Whenever the dialog form is submitted
  //Sends data to the server
  async function onSubmit(values: z.infer<typeof courseAddformSchema>) {
    if (values.courseId) {
      await axios
        .put(
          API_URL + '/courses/' + values.courseId,
          {
            ...values //Spread the values
          },
          { headers: { Authorization: `Bearer ${user?.user?.token}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: 'Cours modifié',
              description: 'Le cours a été modifié avec succès.'
            });
            setOpenDialog(false);
            setCourseToEdit(undefined);
            setCourses((prevCourses) =>
              prevCourses.map((course) =>
                course.id === values.courseId
                  ? { ...course, ...values, id: values.courseId } // Ajoute id à partir de courseId
                  : course
              )
            );
          }
        })
        .catch((err) => {
          if (err.status === 404) {
            toast({
              title: 'Code non existant',
              description: 'Vous ne pouvez pas modifier un cours non existant.',
              variant: 'destructive'
            });
          } else if (err.status === 500) {
            toast({
              title: 'Erreur',
              description: 'Une erreur est survenue lors de la modification du cours.'
            });
          }
        });
    } else {
      await axios
        .post(
          API_URL + '/courses',
          {
            ...values //Spread the values
          },
          { headers: { Authorization: `Bearer ${user?.user?.token}` } }
        )
        .then((res) => {
          if (res.status === 201) {
            toast({
              title: 'Cours ajouté',
              description: 'Le cours a été ajouté avec succès.'
            });
            setCourses([...courses, res.data]);
            setOpenDialog(false);
          }
        })
        .catch((err) => {
          if (err.status === 409) {
            toast({
              title: 'Code déjà existant',
              description: 'Vous ne pouvez pas ajouter un cours avec un code déjà existant.',
              variant: 'destructive'
            });
          } else if (err.status === 500) {
            toast({
              title: 'Erreur',
              description: 'Une erreur est survenue lors de l’ajout du cours.'
            });
          }
        });
    }
  }

  //Fetch the courses from the server
  async function fetchCourses() {
    axios.get(API_URL + '/courses', { headers: { Authorization: `Bearer ${user?.user?.token}` } }).then((res) => {
      if (res.status === 200 && res.data) {
        setCourses(res.data);
      } else if (res.status === 401) {
        toast({
          title: 'Erreur',
          description: 'Vous n’êtes pas autorisé à effectuer cette action.'
        });
        user?.logOut();
      } else if (res.status === 500) {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la récupération des cours.'
        });
      }
    });
  }

  async function deleteCourse(id: number) {
    await axios
      .delete(API_URL + '/courses/' + id, { headers: { Authorization: `Bearer ${user?.user?.token}` } })
      .then((res) => {
        if (res.status === 204) {
          toast({
            title: 'Cours supprimé',
            description: 'Le cours a été supprimé avec succès.'
          });
          setCourses(courses.filter((course) => course.id !== id));
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la suppression du cours.'
          });
        } else if (err.status === 500) {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la suppression du cours.'
          });
        }
      });
  }

  function editCourse(course: Course) {
    setOpenDialog(true);
    setCourseToEdit(course);
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!openDialog) setCourseToEdit(undefined);
  }, [openDialog]);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-bold">Liste des cours</h1>
        <Button variant="outline" onClick={() => setOpenDialog(!openDialog)}>
          Ajouter un cours
        </Button>
      </div>

      <Input
        placeholder="Rechercher un cours"
        className="mt-4 mb-10 -z-10"
        onChange={(e) => setSearch(e.target.value)}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Ajouter un cours</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <AddCourseForm onSubmit={onSubmit} courseToEdit={courseToEdit} />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CoursesTableList
        onEditCourse={editCourse}
        courses={
          search !== ''
            ? courses.filter(
                (s) =>
                  s.code.toLowerCase().includes(search.toLowerCase()) ||
                  s.name.toLowerCase().includes(search.toLowerCase())
              )
            : courses
        }
        onDeleteCourse={deleteCourse}
      />
    </>
  );
}
