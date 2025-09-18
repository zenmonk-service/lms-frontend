import AppBar from "@/components/app-bar";
import { NavigationBar } from "@/components/layout/navbar";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <AppBar />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
