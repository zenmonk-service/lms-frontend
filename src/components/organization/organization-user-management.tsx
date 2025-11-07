"use client";

import AppBar from "@/components/app-bar";
import * as React from "react";

import { ChevronDown, MoreHorizontal, Pencil, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ColumnDef } from "@tanstack/react-table";
import { useAppDispatch, useAppSelector } from "@/store";
import { listUserAction } from "@/features/user/user.action";
import { UserInterface } from "@/features/user/user.slice";
import { format } from "date-fns";
import CreateUser from "@/components/user/create-user";
import { Switch } from "@/components/ui/switch";
import DataTable, { PaginationState } from "../table";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
type Checked = DropdownMenuCheckboxItemProps["checked"];
export default function ManageOrganizationsUser() {
  const dispatch = useAppDispatch();
  const currentOrgUUID = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );

  const { users, isLoading, total } = useAppSelector(
    (state) => state.userSlice
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    page: 1,
    limit: 10,
    search: "",
  });
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [editingUser, setEditingUser] = React.useState<UserInterface | null>(
    null
  );

  const columns: ColumnDef<UserInterface>[] = [
    {
      accessorKey: "name",

      header: () => <div className="pl-12">Name</div>,
      cell: ({ row }) => <div className="pl-12">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div>{row.original.role.name}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const value = row.getValue("created_at");
        const date = value
          ? format(new Date(value as string), "dd-MM-yyyy")
          : "";
        return <div>{date}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
                <div>
          
                  <CreateUser
                    org_uuid={currentOrgUUID}
                    isEdited={true}
                    userData={row.original}
            
                  />

                </div>
                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                  checked={showStatusBar}
                  onCheckedChange={setShowStatusBar}
                >
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showActivityBar}
                  onCheckedChange={setShowActivityBar}
                  disabled
                >
                  Inactive
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];


  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  React.useEffect(() => {
    dispatch(
      listUserAction({
        org_uuid: currentOrgUUID,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          search: pagination.search,
        },
      })
    );
  }, [pagination, currentOrgUUID]);

  return (
    <div className="p-6 h-max-[calc(100vh-69px)]">
      <DataTable
        data={users || []}
        columns={columns}
        isLoading={isLoading}
        totalCount={total || 0}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        searchPlaceholder="Filter organization users..."
        title="User Management"
        description="List of users in the organization."
        noDataMessage="No users found."
      />
    </div>
  );
}
