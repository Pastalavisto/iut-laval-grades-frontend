import { AcademicCapIcon, UserGroupIcon, ChartBarIcon, CheckBadgeIcon } from '@heroicons/react/16/solid';
import NavBarBtn from './NavBarBtn';
import { Link } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger
} from '../ui/sidebar';
import NavBarContent from './NavBarContent';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import NavBarMobileOpen from './NavBarMobileOpen';
import { Description } from '@radix-ui/react-dialog';

interface NavbarProps {
  isLogin: boolean;
}

export default function Navbar(props: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div className="bg-primary-blue flex justify-between max-h-20 select-none">
      <Link to="/" className="p-2">
        <img src="/img/logo-univ.png" className="object-contain max-w-[150px] h-auto" />
      </Link>

      {props.isLogin && (
        <>
          <div className="hidden md:block">
            <NavBarContent />
          </div>

          {isMobile && (
            <SidebarProvider className="md:hidden" open={isSidebarOpen} title="Menu de navigation">
              <Sidebar side="right" title="Menu de navigation">
                <SidebarHeader />
                <SidebarContent title="Menu de navigation">
                  <Link to="/" className="p-2 m-auto">
                    <img src="/img/logo-univ.png" className="object-contain max-w-[150px] h-auto" />
                  </Link>
                  <NavBarContent />
                </SidebarContent>
                <SidebarFooter />
              </Sidebar>
              <NavBarMobileOpen />
            </SidebarProvider>
          )}
        </>
      )}
    </div>
  );
}
