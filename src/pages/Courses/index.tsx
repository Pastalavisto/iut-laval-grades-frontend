import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import AddCourseForm from './AddCourseForm';
import { DialogDescription } from '@radix-ui/react-dialog';
import { courseAddformSchema } from './AddCourseForm';
import { z } from 'zod';
import axios from 'axios';
import { useAuth } from '@/hooks/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import CoursesTableList from './CoursesTableList';
import { Input } from '@/components/ui/input';

export default function Courses() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [courses, setCourses] = useState<z.infer<typeof courseAddformSchema>[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const user = useAuth();
  const { toast } = useToast();

  //Whenever the dialog form is submitted
  //Sends data to the server
  async function onSubmit(values: z.infer<typeof courseAddformSchema>) {
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
          setCourses([...courses, values]);
          setOpenDialog(false);
        }
      })
      .catch((err) => {
        if (err.status === 409) {
          toast({
            title: 'Code déjà existant',
            description: 'Vous ne pouvez pas ajouter un cours avec un code déjà existant.',
            variant: "destructive"
          });
        } else if (err.status === 500) {
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de l’ajout du cours.'
          });
        }
      });
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

  useEffect(() => {
    fetchCourses();
  }, []);

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
          <AddCourseForm onSubmit={onSubmit} />
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
        courses={
          search !== ''
            ? courses.filter(
                (s) =>
                  s.code.toLowerCase().includes(search.toLowerCase()) ||
                  s.name.toLowerCase().includes(search.toLowerCase())
              )
            : courses
        }
      />
    </>
  );
}
