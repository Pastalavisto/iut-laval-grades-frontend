import { z } from 'zod';

import { courseAddformSchema } from './AddCourseForm';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { TrashIcon } from '@heroicons/react/16/solid';

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  description: string;
}

interface CoursesTableListProps {
  courses: Course[]; //List of courses
  onDeleteGrade: (id: string) => void; //Function to delete a course
}

export default function CoursesTableList(props: CoursesTableListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Crédits ECTS</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.courses.map((course) => (
          <TableRow key={course.code + course.name}>
            <TableCell>{course.code}</TableCell>
            <TableCell>{course.name}</TableCell>
            <TableCell>{course.credits}</TableCell>
            <TableCell>{course.description}</TableCell>
            <TableCell>
              <TrashIcon width={20} className="cursor-pointer" onClick={() => props.onDeleteGrade(course.id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
