import { Bars3Icon } from '@heroicons/react/16/solid';
import { useSidebar } from '../ui/sidebar';

export default function NavBarMobileOpen() {
  const { toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar} className="absolute right-0 p-5">
      <Bars3Icon className="size-8 mr-2 text-white" />
    </button>
  );
}
