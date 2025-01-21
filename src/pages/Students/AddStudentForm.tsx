import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

//Define the schema needed for the form
export const userAddformSchema = z.object({
  firstName: z.string({ required_error: 'Entrez un prénom' }),
  lastName: z.string({ required_error: 'Entrez un nom de famille' }),
  email: z.string().email({ message: 'Entrez une adresse email valide' }),
  dateOfBirth: z.date({ required_error: 'Entrez une date valide' }),
  studentId: z.string({ required_error: 'Entrez un numéro d’étudiant' })
});

interface AddStudentFormProps {
  onSubmit: (values: z.infer<typeof userAddformSchema>) => void;
}

export default function AddStudentForm(props: AddStudentFormProps) {
  //Create the form with the schema
  //z.infer generates the type of the form based on the schema
  const form = useForm<z.infer<typeof userAddformSchema>>({
    resolver: zodResolver(userAddformSchema),
    defaultValues: {
      dateOfBirth: new Date()
    }
  });

  //Whenever the dialog form is submitted
  function onSubmit(values: z.infer<typeof userAddformSchema>) {
    props.onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Nathan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de famille</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Dubois" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse e-mail</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Prenom.Nom.Etu@univ-lemans.fr" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de naissance</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? format(field.value, 'yyyy-MM-dd') : <span>Choisis une date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro d’étudiant</FormLabel>
              <FormControl>
                <Input placeholder="Ex: i2200512" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-primary-blue text-white py-2 px-4 rounded-md hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Confirmer
        </Button>
      </form>
    </Form>
  );
}
