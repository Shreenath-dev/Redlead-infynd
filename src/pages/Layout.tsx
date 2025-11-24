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
          {/* <Header /> */}
          {/* make the content area a flex column that fills remaining space
              so pages using flex-1 / h-full can center properly */}
          <div className="flex-1 p-4 overflow-auto flex flex-col">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
