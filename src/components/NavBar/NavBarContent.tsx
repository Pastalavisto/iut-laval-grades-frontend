import { UserGroupIcon, AcademicCapIcon, CheckBadgeIcon } from '@heroicons/react/16/solid';
import { ChartBarIcon, LogOutIcon } from 'lucide-react';
import NavBarBtn from './NavBarBtn';
import { useAuth } from '@/provider/AuthProvider';

export default function NavBarContent() {
  let iconClass = 'size-6 mr-2';
  const auth = useAuth();
  return (
    <div className=" flex flex-col gap-5 p-3 md:flex-row h-full m-auto">
      <NavBarBtn name="Etudiants" link="students" icon={<UserGroupIcon className={iconClass} />} />
      <NavBarBtn name="Cours" link="classes" icon={<AcademicCapIcon className={iconClass} />} />
      <NavBarBtn name="Notes" link="grades" icon={<CheckBadgeIcon className={iconClass} />} />
      <NavBarBtn name="Statistiques" link="stats" icon={<ChartBarIcon className={iconClass} />} />
      <NavBarBtn name="Déconnexion" onClick={() => auth?.logOut()} icon={<LogOutIcon className={iconClass} />} />
    </div>
  );
}
