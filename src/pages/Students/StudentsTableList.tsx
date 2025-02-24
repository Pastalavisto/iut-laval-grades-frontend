import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Student } from '@/types/student';
import { useNavigate } from 'react-router';

interface StudentsTableListProps {
  students: Student[];
}

export default function StudentsTableList(props: StudentsTableListProps) {
  const students = props.students;
  const navigate = useNavigate();

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
          <TableRow
            key={student.studentId}
            className="cursor-pointer"
            onClick={() => navigate(`/students/${student.id}`)}
          >
            <TableCell>{student.firstName + ' ' + student.lastName}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.studentId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
