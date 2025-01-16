import { z } from 'zod';

import { courseAddformSchema } from './AddCourseForm';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface CoursesTableListProps {
  courses: z.infer<typeof courseAddformSchema>[]; //Array of courses
}

export default function CoursesTableList(props: CoursesTableListProps) {
  const courses = props.courses;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Crédits ECTS</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.code + course.name}>
            <TableCell>{course.code}</TableCell>
            <TableCell>{course.name}</TableCell>
            <TableCell>{course.credits}</TableCell>
            <TableCell>{course.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
