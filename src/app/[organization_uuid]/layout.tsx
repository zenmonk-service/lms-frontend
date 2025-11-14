import AppBar from "@/components/app-bar";
import { AppSidebar } from "@/components/layout/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({ children, params }: any) {
  const resolvedParams = await Promise.resolve(params);
  const organization_uuid = Array.isArray(resolvedParams.organization_uuid)
    ? resolvedParams.organization_uuid[0]
    : resolvedParams.organization_uuid;

  return (
    <div className="h-screen flex flex-col">
      {/* <AppBar /> */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar uuid={organization_uuid} />
          <div className="flex flex-col flex-1 overflow-auto">
            <SiteHeader />
            <main>{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
