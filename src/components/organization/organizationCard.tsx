"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Globe,
  Link as LinkIcon,
  Users,
  MoreVertical,
  Trash2,
  Pencil,
  Router,
} from "lucide-react";
import { addCurrentOrganization, addOrganizationRoles, Organization } from "@/features/organizations/organizations.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { getOrganizationRolesAction } from "@/features/organizations/organizations.action";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
}



function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function OrganizationCard({
  org,
  onManageMembers,
  onEdit,
  onDelete,
}: {
  org: Organization;
  onManageMembers: (org: Organization) => void;
  onEdit: (org: Organization) => void;
  onDelete: (org: Organization) => void;
}) {
const dispatch = useAppDispatch();
const {current_organization } = useAppSelector((state)=> state.organizationsSlice)
const router = useRouter();

useEffect(()=> {
  dispatch(getOrganizationRolesAction(current_organization?.uuid));
  
},[])

  function handleClick() {
    dispatch(addCurrentOrganization(org));
    router.push("/dashboard")
  }
  return (
    <Card className="overflow-hidden bg-white border-0 hover:shadow-xl" onClick={handleClick}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{org.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-0.5">
              <Globe className="h-3.5 w-3.5" />
              <span className="truncate max-w-[160px]">
                {org.domain || "—"}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground min-h-[40px]">
          {org?.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between">
          <Button
            className="cursor-pointer w-full shadow-none border-1 border-slate-200"
            onClick={() => onManageMembers(org)}
          >
            <Users className="mr-2 h-4 w-4" /> Manage Organization
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
