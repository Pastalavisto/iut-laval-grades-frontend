import { useAuth } from '@/hooks/AuthProvider';
import { AcademicCapIcon, UserGroupIcon } from '@heroicons/react/16/solid';
import { ChartBarIcon, LogOutIcon } from 'lucide-react';
import NavBarBtn from './NavBarBtn';

export default function NavBarContent() {
  let iconClass = 'size-6 mr-2';
  const auth = useAuth();
  return (
    <div className=" flex flex-col gap-5 p-3 md:flex-row h-full m-auto">
      <NavBarBtn name="Etudiants" link="students" icon={<UserGroupIcon className={iconClass} />} />
      <NavBarBtn name="Cours" link="courses" icon={<AcademicCapIcon className={iconClass} />} />
      <NavBarBtn name="Statistiques" link="stats" icon={<ChartBarIcon className={iconClass} />} />
      <NavBarBtn name="Déconnexion" onClick={() => auth?.logOut()} icon={<LogOutIcon className={iconClass} />} />
    </div>
  );
}
