// [...uid]/layout.tsx
import AppBar from "@/components/app-bar";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  params: { organization_uuid: string}; // catch-all route
}

export default async function Layout({ children, params }: LayoutProps) {
  // Get UUID from route, assuming it's the first segment
  // const uuid = params.uid[0];
const {organization_uuid} = await params

  return (
    <div className="h-screen flex flex-col">
      {/* AppBar */}
      <AppBar />

      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar  uuid={organization_uuid}/>
          {/* Content fills remaining space, scroll only inside */}
          <main className="flex-1 overflow-auto">
            {/* You can pass uuid down to pages */}
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
