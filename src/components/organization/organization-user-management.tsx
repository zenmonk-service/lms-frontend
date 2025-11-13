"use client";

import AppBar from "@/components/app-bar";
import * as React from "react";

import { ChevronDown, MoreHorizontal, Pencil, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { useAppDispatch, useAppSelector } from "@/store";
import { listUserAction } from "@/features/user/user.action";
import { setPagination, UserInterface } from "@/features/user/user.slice";
import { format } from "date-fns";
import CreateUser from "@/components/user/create-user";
import DataTable, { PaginationState } from "@/shared/table";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { hasPermissions } from "@/libs/haspermissios";
import NoReadPermission from "@/shared/no-read-permission";
type Checked = DropdownMenuCheckboxItemProps["checked"];
export default  function ManageOrganizationsUser() {
  const dispatch = useAppDispatch();
  const currentOrgUUID = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );

  const { currentUserRolePermissions } = useAppSelector(
    (state) => state.permissionSlice
  );

  const { users, isLoading, total, pagination ,currentUser } = useAppSelector(
    (state) => state.userSlice
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
    ...(  hasPermissions("user_management", "update", currentUserRolePermissions ,currentUser?.email)
      ? [
          {
            id: "actions",
            header: "Actions",
            enableHiding: true,
            size: 150,
            cell: ({ row }: any) => (
              <CreateUser
                org_uuid={currentOrgUUID}
                isEdited={true}
                userData={row.original}
              />
            ),
          },
        ]
      : []),
  ];

  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    dispatch(setPagination({ ...pagination, ...newPagination }));
  };

  React.useEffect(  () =>  {
    if (true) {
      dispatch(
        listUserAction({
          org_uuid: currentOrgUUID,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            search: pagination.search?.trim(),
          },
        })
      );
    }
  }, [currentOrgUUID, pagination]);

  return (
    <div className="p-6 h-[100vh]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">
            List of users in the organization.
          </p>
        </div>
         {  hasPermissions(
          "user_management",
          "create",
          currentUserRolePermissions ,
          currentUser?.email
        ) && (
          <div>
            <CreateUser org_uuid={currentOrgUUID} isEdited={false} />
          </div>
        )}
      </div>
      {  hasPermissions("user_management", "read", currentUserRolePermissions ,currentUser?.email) ? (
        <DataTable
          data={users || []}
          columns={columns}
          isLoading={isLoading}
          totalCount={total || 0}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          searchPlaceholder="Filter organization users..."
          noDataMessage="No users found."
        />
      ) : (
        <NoReadPermission />
      )}
    </div>
  );
}
