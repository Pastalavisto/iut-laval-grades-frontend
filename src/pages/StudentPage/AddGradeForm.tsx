import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Course } from '@/types/course';
import { Grade } from '@/types/grade';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Define the schema needed for the form based on the Grade interface
export const gradeAddFormSchema = z.object({
  studentId: z.number(),
  courseId: z.string({ required_error: 'Entrez un numéro de cours' }),
  grade: z
    .number({ required_error: 'Entrez une note' })
    .min(0, { message: 'La note doit être supérieure ou égale à 0' })
    .max(20, { message: 'La note doit être inférieure ou égale à 20' }),
  semester: z.string({ required_error: 'Entrez un semestre' }),
  academicYear: z
    .string({ required_error: 'Entrez une année académique' })
    .regex(/^\d{4}-\d{4}$/, { message: "L'année académique doit être au format YYYY-YYYY" })
    .refine(
      (year) => {
        const [startYear, endYear] = year.split('-').map(Number);
        return startYear < endYear;
      },
      { message: "L'année de début doit être inférieure à l'année de fin" }
    ),
  gradeId: z.number().optional() // For edit purposes
});

interface AddGradeFormProps {
  id: number;
  courses: Course[];
  gradeToEdit?: Grade;
  onSubmit: (values: z.infer<typeof gradeAddFormSchema>) => void;
}

export default function AddGradeForm(props: AddGradeFormProps) {
  const gradeToEdit: Grade | undefined = props.gradeToEdit;

  const defaultValues = {
    studentId: props.id,
    courseId: gradeToEdit?.courseId?.toString() || '',
    grade: gradeToEdit?.grade !== undefined ? Number(gradeToEdit.grade) : undefined,
    semester: gradeToEdit?.semester || '',
    academicYear: gradeToEdit?.academicYear || '',
    gradeId: gradeToEdit?.id
  };

  const form = useForm<z.infer<typeof gradeAddFormSchema>>({
    resolver: zodResolver(gradeAddFormSchema),
    defaultValues: defaultValues
  });

  //Whenever the dialog form is submitted
  function onSubmit(values: z.infer<typeof gradeAddFormSchema>) {
    props.onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cours</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ''} disabled={gradeToEdit !== undefined}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Nom de la matière" />
                    <SelectContent>
                      {props.courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Input
                  placeholder="Note entre 0 et 20"
                  {...field}
                  value={field.value ?? ''}
                  type="number"
                  min={0}
                  max={20}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semestre</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ''} disabled={gradeToEdit !== undefined}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Semestre" />
                    <SelectContent>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                      <SelectItem value="S4">S4</SelectItem>
                    </SelectContent>
                  </SelectTrigger>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="academicYear"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Année Scolaire</FormLabel>
              <FormControl>
                <Input
                  placeholder="2021-2022"
                  {...field}
                  value={field.value || ''}
                  disabled={gradeToEdit !== undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value={props.id} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {gradeToEdit && (
          <FormField
            control={form.control}
            name="gradeId"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} value={props.id} readOnly />
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
