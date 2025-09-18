"use client";
import React, { useEffect } from "react";

import AppBar from "@/components/app-bar";

import { useAppDispatch } from "@/store";
import { getOrganizationById } from "@/features/organizations/organizations.action";

function Dashboard({
  organization_uuid,
  email,
}: {
  organization_uuid: string;
  email: string;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getOrganizationById({ organizationId: organization_uuid, email })
    );
  }, [organization_uuid]);

  return (
 <div className="h-full bg-gradient-to-br from-orange-50 via-white to-orange-50">
  <main className="max-w-6xl mx-auto px-6 py-8 flex-1 flex flex-col gap-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Zenmonk</h2>
    </div>
    {/* <OrganizationUpdateForm /> */}
    {/* <MembersSection /> */}
  </main>
</div>

  );
}

export default Dashboard;
