import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Course } from '@/types/course';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

interface CoursesTableListProps {
  courses: Course[];
  onDeleteCourse: (id: number) => void;
  onEditCourse: (course: Course) => void;
}

export default function CoursesTableList(props: CoursesTableListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25%]">Code</TableHead>
          <TableHead className="w-[25%]">Nom</TableHead>
          <TableHead className="w-[25%]">Crédits ECTS</TableHead>
          <TableHead className="w-[25%]">Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.courses.map((course) => (
          <TableRow key={course.code + course.name}>
            <TableCell>{course.code}</TableCell>
            <TableCell>{course.name}</TableCell>
            <TableCell>{course.credits}</TableCell>
            <TableCell>{course.description}</TableCell>
            <TableCell className='flex gap-2'>
              <PencilIcon width={20} className="cursor-pointer" onClick={() => props.onEditCourse(course)} />
              <TrashIcon width={20} className="cursor-pointer" onClick={() => props.onDeleteCourse(course.id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
