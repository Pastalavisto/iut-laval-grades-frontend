import { z } from 'zod';

import { userAddformSchema } from './AddStudentForm';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface StudentsTableListProps {
  students: z.infer<typeof userAddformSchema>[]; //Array of students
}

export default function StudentsTableList(props: StudentsTableListProps) {
  const students = props.students;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20%]">Nom</TableHead>
          <TableHead>Adresse Mail</TableHead>
          <TableHead>Numéro d'étudiant</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.studentId}>
            <TableCell>{student.firstName + ' ' + student.lastName}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.studentId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
