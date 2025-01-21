import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import AddStudentForm from './AddStudentForm';
import { DialogDescription } from '@radix-ui/react-dialog';
import { userAddformSchema } from './AddStudentForm';
import { z } from 'zod';
import axios from 'axios';
import { useAuth } from '@/hooks/AuthProvider';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import StudentsTableList from './StudentsTableList';
import { Input } from '@/components/ui/input';
import { Student } from '@/types/student';

export default function Students() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const user = useAuth();
  const { toast } = useToast();

  //Whenever the dialog form is submitted
  //Sends data to the server
  async function onSubmit(values: z.infer<typeof userAddformSchema>) {
    await axios
      .post(
        API_URL + '/students',
        {
          ...values, //Spread the values
          dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd') //Convert date to ISO string
        },
        { headers: { Authorization: `Bearer ${user?.user?.token}` } }
      )
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: 'Étudiant ajouté',
            description: 'L’étudiant a été ajouté avec succès.'
          });
          setStudents([...students, res.data]);
          setOpenDialog(false);
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
            description: 'Une erreur est survenue lors de l’ajout de l’étudiant.'
          });
        }
      });
  }

  //Fetch the students from the server
  async function fetchStudents() {
    axios
      .get(API_URL + '/students', { headers: { Authorization: `Bearer ${user?.user?.token}` } })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setStudents(res.data);
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
            description: 'Une erreur est survenue lors de la récupération des étudiants.'
          });
        }
      });
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-bold">Liste des étudiants</h1>
        <Button variant="outline" onClick={() => setOpenDialog(!openDialog)}>
          Ajouter un étudiant
        </Button>
      </div>

      <Input
        placeholder="Rechercher un étudiant"
        className="mt-4 mb-10 -z-10"
        onChange={(e) => setSearch(e.target.value)}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Ajouter un étudiant</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <AddStudentForm onSubmit={onSubmit} />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <StudentsTableList
        students={
          search !== ''
            ? students.filter(
                (s) =>
                  s.firstName.toLowerCase().includes(search.toLowerCase()) ||
                  s.lastName.toLowerCase().includes(search.toLowerCase())
              )
            : students
        }
      />
    </>
  );
}
