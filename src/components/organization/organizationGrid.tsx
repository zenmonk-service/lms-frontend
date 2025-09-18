"use client";

import React, { useEffect } from "react";
import OrganizationCard from "./organizationCard";
import { AdminTablePagination } from "./pagination";
import { useAppSelector } from "@/store";

import LoadingSkelton from "./loadingSkelton";

export default function OrganizationGrid() {
  const { isLoading, organizations, total, currentPage } = useAppSelector(
    (state) => state.organizationsSlice
  );
  
  const handleManageMembers = (org: any) => {
    console.log("Manage members clicked for", org);
  };

  const handleEdit = (org: any) => {
    console.log("Edit clicked for", org);
  };

  const handleDelete = (org: any) => {
    console.log("Delete clicked for", org);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <LoadingSkelton />
        ) : (
          organizations.map((org) => (
            <OrganizationCard
              key={org.id}
              org={org}
              onManageMembers={handleManageMembers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
        {organizations.length === 0 && !isLoading && (
          <p>No organization available</p>
        )}
      </div>
      {currentPage && total && (
        <AdminTablePagination
          total={total}
          currentPage={currentPage}
          pageSize={10}
          onPageChange={function (page: number): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
}
