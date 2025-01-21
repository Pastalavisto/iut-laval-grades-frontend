import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAuth } from '@/hooks/AuthProvider';
import { Course } from '@/types/course';
import { Student } from '@/types/student';
import axios from 'axios';
import { useEffect, useState } from 'react';
import FilterBar from './FilterBar';
import StatisticDisplay from './StatisticDisplay';

interface globalStatistic {
  globalAverage: number;
  totalStudents: number;
  totalCourses: number;
  averageSuccessRate: number;
}

interface courseStatistic {
  courseCode: string;
  courseName: string;
  averageGrade: number;
  minGrade: number;
  maxGrade: number;
  totalStudents: number;
  successRate: number;
}

interface studentStatistic {
  semester: string;
  averageGrade: number;
  totalCredits: number;
  validatedCredits: number;
  coursesCount: number;
}

export default function Statistics() {
  const API_URL = import.meta.env.VITE_API_URL;
  const user = useAuth();
  const [globalStatistics, setGlobalStatistics] = useState<globalStatistic>({
    globalAverage: 0,
    totalStudents: 0,
    totalCourses: 0,
    averageSuccessRate: 0
  });
  const [courseStatistics, setCourseStatistics] = useState<courseStatistic>({
    courseCode: '',
    courseName: '',
    averageGrade: 0,
    minGrade: 0,
    maxGrade: 0,
    totalStudents: 0,
    successRate: 0
  });
  const [studentStatistics, setStudentStatistics] = useState<studentStatistic[]>([]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [years, setYears] = useState<string[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [totalValidatedCredits, setTotalValidatedCredits] = useState<number>(0);
  const [totalCoursesAttended, setTotalCoursesAttended] = useState<number>(0);

  async function fetchGlobalStatistics(year: string) {
    axios
      .get(API_URL + '/stats/global', {
        params: { academicYear: year },
        headers: { Authorization: `Bearer ${user?.user?.token}` }
      })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setGlobalStatistics(res.data);
        }
      });
  }

  async function fetchCourseStatistics(courseId: number, year: string) {
    axios
      .get(API_URL + '/stats/course/' + courseId, {
        params: { academicYear: year },
        headers: { Authorization: `Bearer ${user?.user?.token}` }
      })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setCourseStatistics(res.data);
        }
      });
  }

  async function fetchStudentStatistics(studentId: number, year: string) {
    axios
      .get(API_URL + '/stats/student/' + studentId, {
        params: { academicYear: year },
        headers: { Authorization: `Bearer ${user?.user?.token}` }
      })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setStudentStatistics(res.data);
          setTotalValidatedCredits(0);
          setTotalCoursesAttended(0);
          for (let i = 0; i < res.data.length; i++) {
            setTotalValidatedCredits((prev) => prev + parseInt(res.data[i].validatedCredits));
            setTotalCoursesAttended((prev) => prev + parseInt(res.data[i].coursesCount));
          }
        }
      });
  }

  const fetchCourses = async () => {
    return axios
      .get(API_URL + '/courses', { headers: { Authorization: `Bearer ${user?.user?.token}` } })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setCourses(res.data);
          if (selectedCourse === undefined) {
            setSelectedCourse(res.data[0]);
          }
          return res.data;
        }
      });
  };

  const fetchStudents = async () => {
    return axios
      .get(API_URL + '/students', { headers: { Authorization: `Bearer ${user?.user?.token}` } })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setStudents(res.data);
          if (selectedStudent === undefined) {
            setSelectedStudent(res.data[0]);
          }
          return res.data;
        }
      });
  };

  const fetchYears = async () => {
    const res = await axios.get(API_URL + '/grades/years', {
      headers: {
        Authorization: `Bearer ${user?.user?.token}`
      }
    });
    setYears(res.data);
    if (selectedYear === '') {
      setSelectedYear(res.data[0]);
    }
    return res.data;
  };

  useEffect(() => {
    async function fetchPageData() {
      let year = '';
      await fetchYears().then((res) => {
        year = res[0];
        fetchGlobalStatistics(year);
      });
      await fetchCourses().then((res) => {
        fetchCourseStatistics(res[0].id, year);
      });
      await fetchStudents().then((res) => {
        fetchStudentStatistics(res[0].id, year);
      });
    }

    fetchPageData();
  }, []);

  return (
    <>
      <h1 className="font-bold mb-4">Statistiques</h1>
      <div>
        <h2 className="mb-4">Statistiques globales</h2>
        <Select
          value={selectedYear}
          onValueChange={(value) => {
            setSelectedYear(value);
            fetchGlobalStatistics(value);
            fetchCourseStatistics(selectedCourse?.id || courses[0].id, value);
            fetchStudentStatistics(selectedStudent?.id || students[0].id, value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une année" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Année</SelectLabel>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap space-y-4 md:flex-nowrap md:space-x-4 md:space-y-0 justify-evenly mb-4 mt-4">
          <StatisticDisplay
            numberStatistic={parseFloat(globalStatistics.globalAverage.toString()).toFixed(2)}
            labelStatistic={'Moyenne générale'}
            descriptionStatistic={'Moyenne de toutes les notes'}
          />
          <StatisticDisplay
            numberStatistic={globalStatistics.totalStudents.toString()}
            labelStatistic={"Nombre d'étudiants"}
            descriptionStatistic={'Total des étudiants inscrits'}
          />
          <StatisticDisplay
            numberStatistic={globalStatistics.totalCourses.toString()}
            labelStatistic={'Nombre de cours'}
            descriptionStatistic={'Total des cours disponibles'}
          />
          <StatisticDisplay
            numberStatistic={parseFloat(globalStatistics.averageSuccessRate.toString()).toFixed(2) + '%'}
            labelStatistic={'Taux de réussite'}
            descriptionStatistic={'Taux de réussite moyen'}
          />
        </div>
      </div>
      <div>
        <h2>Statistiques par cours</h2>
        <FilterBar
          defaultValue={selectedCourse?.name || 'Chargement...'}
          suggestions={courses.map((course) => {
            return { value: course.name, id: course.id };
          })}
          onChange={(value: number) => {
            setSelectedCourse(courses.find((course) => course.id === value));
            fetchCourseStatistics(value, selectedYear);
          }}
        />
        <div className="flex flex-wrap space-y-4 md:flex-nowrap md:space-x-4 md:space-y-0 justify-evenly mb-4">
          <StatisticDisplay
            numberStatistic={parseFloat(courseStatistics.averageGrade.toString()).toFixed(2) + '/20'}
            labelStatistic={'Moyenne du cours'}
            descriptionStatistic={'Moyenne des notes obtenues'}
          />
          <StatisticDisplay
            numberStatistic={parseFloat(courseStatistics.minGrade.toString()).toFixed(2) + '/20'}
            labelStatistic={'Note minimale'}
            descriptionStatistic={'Note la plus basse'}
          />
          <StatisticDisplay
            numberStatistic={parseFloat(courseStatistics.maxGrade.toString()).toFixed(2) + '/20'}
            labelStatistic={'Note maximale'}
            descriptionStatistic={'Note la plus haute'}
          />
          <StatisticDisplay
            numberStatistic={parseFloat(courseStatistics.successRate.toString()).toFixed(2) + ' %'}
            labelStatistic={'Taux de réussite'}
            descriptionStatistic={'Pourcentage de réussite'}
          />
        </div>
      </div>
      <div>
        <h2>Statistiques par étudiant</h2>
        <FilterBar
          defaultValue={selectedStudent ? selectedStudent.firstName + ' ' + selectedStudent.lastName : 'Chargement...'}
          suggestions={students.map((student) => {
            return { value: student.firstName + ' ' + student.lastName, id: student.id };
          })}
          onChange={(value: number) => {
            setSelectedStudent(students.find((student) => student.id === value));
            fetchStudentStatistics(value, selectedYear);
          }}
        />
        <div className="flex flex-wrap space-y-4 md:flex-nowrap md:space-x-4 md:space-y-0 mb-4">
          <StatisticDisplay
            numberStatistic={totalValidatedCredits.toString()}
            labelStatistic={'Crédits validés'}
            descriptionStatistic={'Total des crédits obtenus'}
          />
          <StatisticDisplay
            numberStatistic={totalCoursesAttended.toString()}
            labelStatistic={'Nombre de cours'}
            descriptionStatistic={'Cours suivis'}
          />
        </div>
        <div className="flex flex-wrap space-y-4 md:flex-nowrap md:space-x-4 md:space-y-0 mb-4">
          {studentStatistics.map((statistic) => (
            <StatisticDisplay
              key={statistic.semester}
              numberStatistic={parseFloat(statistic.averageGrade.toString()).toFixed(2) + '/20'}
              labelStatistic={'Moyenne semestre ' + statistic.semester}
              descriptionStatistic={statistic.validatedCredits.toString() + 'crédits validés'}
            />
          ))}
        </div>
      </div>
    </>
  );
}
