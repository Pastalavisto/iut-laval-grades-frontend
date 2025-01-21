import { FilterBar } from './FilterBar';
import { StatisticDisplay } from './StatisticDisplay';
import axios from 'axios';
import { useAuth } from '@/hooks/AuthProvider';
import { useEffect, useState } from 'react';

interface globalStatistic {
    globalAverage: number,
    totalStudents: number,
    totalCourses: number,
    averageSuccessRate: number
}

interface courseStatistic {
    courseCode: string,
    courseName: string,
    averageGrade: number,
    minGrade: number,
    maxGrade: number,
    totalStudents: number,
    successRate: number
}

interface studentStatistic {
    semester: string,
    averageGrade: number,
    totalCredits: number,
    validateCredits: number,
    coursesCount: number;
}
  
function Statistics() {
    const API_URL = import.meta.env.VITE_API_URL;
    const user = useAuth();
    const [globalStatistics, setGlobalStatistics] = useState<globalStatistic>({
        globalAverage: 0,
        totalStudents: 0,
        totalCourses: 0,
        averageSuccessRate: 0,
      });
      const [courseStatistics, setCourseStatistics] = useState<courseStatistic>({
        courseCode: "",
        courseName: "",
        averageGrade: 0,
        minGrade: 0,
        maxGrade: 0,
        totalStudents: 0,
        successRate: 0
      });
      const [studentStatistics, setStudentStatistics] = useState<studentStatistic>({
        semester: "",
        averageGrade: 0,
        totalCredits: 0,
        validateCredits: 0,
        coursesCount: 0,

      });
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    category: 'all',
    dateRange: 'last7days',
    status: 'active',
  });

  async function fetchGlobalStatistics() {
    axios.get(API_URL + '/stats/global', { headers: { Authorization: `Bearer ${user?.user?.token}` } }).then((res) => {
      if (res.status === 200 && res.data) {
        setGlobalStatistics(res.data);
      }
    });
  }

  async function fetchCourseStatistics() {
    axios.get(API_URL + '/stats/course', { headers: { Authorization: `Bearer ${user?.user?.token}` } }).then((res) => {
      if (res.status === 200 && res.data) {
        setCourseStatistics(res.data);
      }
    });
  }

  async function fetchStudentStatistics() {
    axios.get(API_URL + '/stats/student', { headers: { Authorization: `Bearer ${user?.user?.token}` } }).then((res) => {
      if (res.status === 200 && res.data) {
        setStudentStatistics(res.data);
      }
    });
  }

  const handleFilterChange = (newFilters: { [key: string]: string }) => {
    setFilters(newFilters);
  };
  const styles = {
    title: {
        fontSize: '25px',
        fontWeight: 'bold',
    },
    secondTitle: {
        fontSize: '20px',
    },
    box: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: '150vh',
      },
    statisticDisplay: {
        position: 'relative' as const,
    }
    
}
const suggestions = [
    'React',
    'Angular',
    'Vue',
    'Svelte',
    'JavaScript',
    'TypeScript',
    'Python',
  ];
  useEffect(() => {
    fetchGlobalStatistics();
    fetchCourseStatistics();
    fetchStudentStatistics();
  }, []);

  return (
    <div style={styles.box}>
        <h1 style={styles.title}>Statistiques</h1>
        <div>
            <h2 style={styles.secondTitle}>Statistiques globales</h2>
            <div style={styles.statisticDisplay}>
                <StatisticDisplay filters={filters} numberStatistic={globalStatistics.globalAverage.toString()} labelStatistic={"Moyenne générale"} descriptionStatistic={"Moyenne de toutes les notes"}/>
                <StatisticDisplay filters={filters} numberStatistic={globalStatistics.totalStudents.toString()} labelStatistic={"Nombre d'étudiants"} descriptionStatistic={"Total des étudiants inscrits"}/>
                <StatisticDisplay filters={filters} numberStatistic={globalStatistics.totalCourses.toString()} labelStatistic={"Nombre de cours"} descriptionStatistic={"Total des cours disponibles"}/>
                <StatisticDisplay filters={filters} numberStatistic={globalStatistics.averageSuccessRate.toString()} labelStatistic={"Taux de réussite"} descriptionStatistic={"Taux de réussite moyen"}/>
            </div>
        </div>
        <div>
            <h2 style={styles.secondTitle}>Statistiques par cours</h2>
            <FilterBar suggestions={suggestions} onFilterChange={handleFilterChange} />
            <div>
                <StatisticDisplay filters={filters} numberStatistic={courseStatistics.averageGrade + "/20"} labelStatistic={"Moyenne du cours"} descriptionStatistic={"Moyenne des notes obtenues"}/>
                <StatisticDisplay filters={filters} numberStatistic={courseStatistics.minGrade + "/20"} labelStatistic={"Note minimale"} descriptionStatistic={"Note la plus basse"}/>
                <StatisticDisplay filters={filters} numberStatistic={courseStatistics.maxGrade + "/20"} labelStatistic={"Note maximale"} descriptionStatistic={"Note la plus haute"}/>
                <StatisticDisplay filters={filters} numberStatistic={courseStatistics.successRate + " %"} labelStatistic={"Taux de réussite"} descriptionStatistic={"Pourcentage de réussite"}/>
            </div>
        </div>
        <div>
            <h2 style={styles.secondTitle}>Statistiques par étudiant</h2>
            <FilterBar suggestions={suggestions} onFilterChange={handleFilterChange} />
            <div>
                <StatisticDisplay filters={filters} numberStatistic={studentStatistics.totalCredits.toString()} labelStatistic={"Crédits validés"} descriptionStatistic={"Total des crédits obtenus"}/>
                <StatisticDisplay filters={filters} numberStatistic={studentStatistics.coursesCount.toString()} labelStatistic={"Nombre de cours"} descriptionStatistic={"Cours suivis"}/>
                <StatisticDisplay filters={filters} numberStatistic={studentStatistics.averageGrade.toString() + "/20"} labelStatistic={"Moyenne semestre S3"} descriptionStatistic={studentStatistics.validateCredits.toString() + "crédits validés"}/>
                <StatisticDisplay filters={filters} numberStatistic={studentStatistics.averageGrade.toString() + "/20"} labelStatistic={"Moyenne semestre S4"} descriptionStatistic={studentStatistics.validateCredits.toString() + "crédits validés"}/>
            </div>
        </div>
    </div>
  );
}

export default Statistics;
