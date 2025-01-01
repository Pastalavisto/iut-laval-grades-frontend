import { Link } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from '../ui/sidebar';
import NavBarContent from './NavBarContent';
import { useIsMobile } from '@/hooks/use-mobile';
import NavBarMobileOpen from './NavBarMobileOpen';
import { useAuth } from '@/hooks/AuthProvider';

export default function Navbar() {
  const isLogin = useAuth()?.user !== null;
  const isMobile = useIsMobile();
  return (
    <div className="bg-primary-blue flex justify-between max-h-20 select-none">
      <Link to="/" className="p-2">
        <img src="/img/logo-univ.png" className="object-contain max-w-[150px] h-auto" />
      </Link>

      {isLogin && (
        <>
          <div className="hidden md:block">
            <NavBarContent />
          </div>

          {isMobile && (
            <SidebarProvider className="md:hidden" title="Menu de navigation">
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
