import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="h-14 border-b border-divider bg-background flex items-center px-4 sticky top-0 z-10">
      <SidebarTrigger className="mr-4 transition-transform duration-300 ease-in-out" />
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">RL</span>
        </div>
        <span className="font-semibold text-lg select-none">RedLead</span>
      </div>
    </header>
  );
}