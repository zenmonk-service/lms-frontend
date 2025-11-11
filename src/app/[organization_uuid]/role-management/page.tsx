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
import { format } from "date-fns";
import DataTable, { PaginationState } from "@/shared/table";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { getOrganizationRolesAction } from "@/features/role/role.action";
import { Role, setPagination } from "@/features/role/role.slice";
import AssignPermission from "@/components/permission/assign-permission";
import { listRolePermissions } from "@/features/permissions/permission.service";
import { listOrganizationPermissionsAction, listRolePermissionsAction } from "@/features/permissions/permission.action";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Checked = DropdownMenuCheckboxItemProps["checked"];
export default function RoleManagement() {
  const dispatch = useAppDispatch();
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null);

  const currentOrgUUID = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );
  const { roles, isLoading, total, pagination } = useAppSelector(
    (state) => state.rolesSlice
  );

  const { rolePermissions, permissions, isLoading: isLoadingPermissions } = useAppSelector(
    (state) => state.permissionSlice
  );

  console.log('✌️permissions --->', permissions);
  console.log('✌️rolePermissions --->', rolePermissions);

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: () => <div className="pl-12">Name</div>,
      cell: ({ row }) => <div className="pl-12">{row.getValue("name")}</div>,
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.original.description}</div>,
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
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Button
              onClick={() => {
                getRolePermissions(row.original.uuid);
                setSelectedRoleId(row.original.uuid);
                setAssignDialogOpen(true);
              }}
              variant="ghost"
              className="justify-start w-full"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Manage Permissions
            </Button>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleSave = (ids: string[]) => {
    console.log("Submit these permission IDs:", ids);
    // call your backend: /roles/:role_id/permissions
  };

  const getRolePermissions = async (role_uuid: string) => {
    dispatch(
      listRolePermissionsAction({ org_uuid: currentOrgUUID, role_uuid })
    );
  };
  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    dispatch(setPagination({ ...pagination, ...newPagination }));
  };

  React.useEffect(() => {
    dispatch(
      getOrganizationRolesAction({
        org_uuid: currentOrgUUID,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          search: pagination.search?.trim(),
        },
      })
    );
    dispatch(
      listOrganizationPermissionsAction({ org_uuid: currentOrgUUID })
    );
  }, [currentOrgUUID, pagination]);

  return (
    <div className="p-6 h-max-[calc(100vh-69px)]">
      <div className="flex items-center justify-between mb-4 ">
        <div>
          <h2 className="text-lg font-semibold">Role Management</h2>
          <p className="text-sm text-muted-foreground">
            List of roles in the organization.
          </p>
        </div>
      </div>
      <DataTable
        data={roles || []}
        columns={columns}
        isLoading={isLoading}
        totalCount={total || 0}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        searchPlaceholder="Filter organization roles..."
        noDataMessage="No roles found."
      />
      {/* AssignPermission Dialog rendered once at the top level */}
      <div className="h-[500px] w-0 overflow-hidden">
      <Dialog open={assignDialogOpen}  onOpenChange={setAssignDialogOpen}>
        <DialogContent className="h-[70%] min-w-[650px]">
          <DialogTitle className="text-lg font-semibold mb-2">Manage Permissions</DialogTitle>
          <AssignPermission
            selectedPermissions={rolePermissions.role_permissions}
            permissions={permissions}
            onSave={handleSave}
            isLoading={isLoadingPermissions}
          />
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
