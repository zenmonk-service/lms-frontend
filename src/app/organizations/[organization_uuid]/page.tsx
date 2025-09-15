import React from "react";

import AppBar from "@/components/app-bar";

import { getOrganizationsById } from "@/features/organizations/organizations.service";
import { OrganizationUpdateForm, OrgFormValues } from "@/components/organization/organizationDetails";
import { MembersSection } from "@/components/organization/membersSection";

async function Dashboard() {
//   const organizationData = await getOrganizationsById("zwxxsx");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <AppBar />

      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 flex flex-col gap-8">
        <div className="text-center ">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Zenmonk</h2>
        </div>
          <OrganizationUpdateForm onSubmit={function (values: OrgFormValues): void {
          throw new Error("Function not implemented.");
        } } />
        <MembersSection />
      </main>
    </div>
  );
}

export default Dashboard;
