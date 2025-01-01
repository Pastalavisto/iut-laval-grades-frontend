import { ReactNode } from 'react';
import { useNavigate } from 'react-router';

interface NavBarBtnProps {
  name: string;
  link: string;
  icon: ReactNode;
}

export default function NavBarBtn(props: NavBarBtnProps) {
  let navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(props.link)}
      className="flex items-center text-white rounded-lg px-3 transition-all group"
    >
      {props.icon}
      <span className="relative after:bg-white after:absolute after:h-[2px] after:w-0 after:-bottom-0.5 after:left-0 group-hover:after:w-full after:transition-all after:duration-300">
        {props.name}
      </span>
    </button>
  );
}
