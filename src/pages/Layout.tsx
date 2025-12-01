import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex w-full bg-background">
        <AppSidebar />
          <div className="flex-1 flex flex-col">
          
          <div className="flex-1 p-4 overflow-auto flex flex-col">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
