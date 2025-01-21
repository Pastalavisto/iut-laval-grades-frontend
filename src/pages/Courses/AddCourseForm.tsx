import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@/types/course';

//Define the schema needed for the form
export const courseAddformSchema = z.object({
  courseId: z.number().optional(), // Edit purposes
  code: z.string({ required_error: 'Entrez un code' }),
  name: z.string({ required_error: 'Entrez un nom' }),
  credits: z
    .number({ required_error: 'Entrez une valeur', message: 'Entrez une valeur' })
    .min(1, { message: 'Le nombre de crédits ECTS doit être supérieur ou égal à 1' })
    .max(60, { message: 'Le nombre de crédits ECTS doit être inférieur ou égal à 60' }),
  description: z.string().optional()
});

interface AddCourseFormProps {
  onSubmit: (values: z.infer<typeof courseAddformSchema>) => void;
  courseToEdit?: Course
}

export default function AddCourseForm(props: AddCourseFormProps) {
  const courseToEdit = props.courseToEdit;

  //Create the form with the schema
  //z.infer generates the type of the form based on the schema
  const form = useForm<z.infer<typeof courseAddformSchema>>({
    resolver: zodResolver(courseAddformSchema),
    defaultValues: {
      courseId: courseToEdit?.id,
      code: courseToEdit?.code || undefined,
      name: courseToEdit?.name || undefined,
      credits: courseToEdit?.credits || 1,
      description: courseToEdit?.description || undefined
    }
  });

  //Whenever the dialog form is submitted
  function onSubmit(values: z.infer<typeof courseAddformSchema>) {
    props.onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Ex: R5.05" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du cours</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Développement web" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="credits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crédits ECTS</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={1} max={60} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description du cours" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {courseToEdit && (
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type='hidden' {...field} value={courseToEdit.id} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
