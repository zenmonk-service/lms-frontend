"use client";

import React, { useEffect, useState } from "react";

import AppBar from "@/components/app-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataGridDemo from "@/components/table";

import Settings from "@/components/organization/settings";
import ExampleUsage from "@/components/organization/organizationGrid";
import CreateOrganizationForm from "@/components/organization/createOrganization";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/store";
import { getOrganizationsAction } from "@/features/organizations/organizations.action";
import { useSession } from "next-auth/react";

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(
      getOrganizationsAction({
        uuid: "44bc8d4e-606b-437c-990f-5be5807ffa46",
        page: 1,
        limit: 10,
        search: search,
      })
    );
  }, [search ]);

  const handleSubmit = (data: any) => {
    console.log("New org data:", data);
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <AppBar />

      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 flex flex-col gap-8">
        <div className="text-center ">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Manage organization
          </h2>
        </div>

        <div className="flex gap-8 justify-between">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value as string)}
            className="border-0 bg-white outline-0 max-w-md"
            placeholder="Search organization..."
          ></Input>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 text-white font-bold cursor-pointer">
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Create a new Organization</DialogTitle>
              </DialogHeader>
              <CreateOrganizationForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <ExampleUsage />
        </div>
      </main>
      <div></div>
    </div>
  );
}

export default Dashboard;
