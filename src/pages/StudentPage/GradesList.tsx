import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Grade } from '@/types/grade';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

interface GradesListProps {
  grades: Grade[] | undefined;
  isLoading: boolean;
  year: string;
  onDeleteGrade: (studentId: number) => void;
  onEditGrade: (grade: Grade) => void;
}

export default function GradesList(props: GradesListProps) {
  const { grades } = props;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom du cours</TableHead>
          <TableHead>Semestre</TableHead>
          <TableHead>Note</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {grades && grades.length > 0 ? (
          grades.map((grade) => {
            if (grade.academicYear !== props.year) {
              return null;
            }
            return (
              <TableRow key={grade.id}>
                <TableCell className="w-[25%]">{grade.courseName}</TableCell>
                <TableCell>{grade.semester}</TableCell>
                <TableCell>{grade.grade}</TableCell>
                <TableCell className="flex gap-2">
                  <PencilIcon width={20} className="cursor-pointer" onClick={() => props.onEditGrade(grade)} />
                  <TrashIcon width={20} className="cursor-pointer" onClick={() => props.onDeleteGrade(grade.id)} />
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              {props.isLoading ? 'Chargement...' : 'Aucune note disponible'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
