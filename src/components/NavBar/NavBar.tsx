import { AcademicCapIcon, UserGroupIcon, ChartBarIcon, CheckBadgeIcon } from "@heroicons/react/16/solid";
import NavBarBtn from "./NavBarBtn";
import { Link } from "react-router";

interface NavbarProps {
    isLogin: boolean;
}

export default function Navbar(props: NavbarProps) {
    let iconClass = "size-6 mr-2";
    return (
        <div className='bg-primary-blue flex justify-between max-h-20 select-none'>
            <Link to='/' className='p-2'>
                <img src='/img/logo-univ.png' className='object-contain max-w-[150px] h-auto' />
            </Link>
            {
                props.isLogin && (
                    <div className='flex gap-5 p-3'>
                        <NavBarBtn name="Etudiants" link='students' icon={<UserGroupIcon className={iconClass} />} />
                        <NavBarBtn name="Cours" link='classes' icon={<AcademicCapIcon className={iconClass} />} />
                        <NavBarBtn name="Notes" link='grades' icon={<CheckBadgeIcon className={iconClass} />} />
                        <NavBarBtn name="Statistiques" link='stats' icon={<ChartBarIcon className={iconClass} />} />
                    </div>
                )
            }
        </div>
    )
}