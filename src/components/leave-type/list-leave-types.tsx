"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getLeaveTypesAction } from "@/features/leave-types/leave-types.action";
import { LeaveTypes, useLeaveTypesColumns } from "./list-leave-types-columns";
import LeaveTypeForm from "./leave-type-form";
import DataTable, { PaginationState } from "../table";

export default function ListLeaveTypes() {
  const dispatch = useAppDispatch();
  const { leaveTypes, isLoading } = useAppSelector(
    (state) => state.leaveTypeSlice
  );

  const currentOrgUUID = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypes | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    search: "",
  });

  const handleEdit = (leaveType: LeaveTypes) => {
    setSelectedLeaveType(leaveType);
    setEditDialogOpen(true);
  };

  const columns = useLeaveTypesColumns(handleEdit, currentOrgUUID);

  useEffect(() => {
    if (currentOrgUUID) {
      dispatch(
        getLeaveTypesAction({
          org_uuid: currentOrgUUID,
          page: pagination.page,
          limit: pagination.limit,
          search: pagination.search,
        })
      );
    }
  }, [dispatch, currentOrgUUID, pagination]);

  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 ">
        <div>
          <h2 className="text-lg font-semibold">All Leave Types</h2>
          <p className="text-sm text-muted-foreground">
            List of configured leave types for the organization.
          </p>
        </div>
      </div>
      <DataTable
        data={leaveTypes?.rows || []}
        columns={columns}
        isLoading={isLoading}
        totalCount={leaveTypes?.count || 0}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        searchPlaceholder="Filter leave types..."
        noDataMessage="No leave types found."
      />
      {selectedLeaveType && (
        <LeaveTypeForm
          label="edit"
          data={{
            name: selectedLeaveType.name,
            code: selectedLeaveType.code,
            description: selectedLeaveType.description,
            applicableRoles: selectedLeaveType.applicable_for.value,
            accrualFrequency: selectedLeaveType.accrual?.period as any,
            leaveCount: selectedLeaveType.accrual?.leave_count,
          }}
          leave_type_uuid={selectedLeaveType.uuid}
          isOpen={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedLeaveType(null);
          }}
        />
      )}
    </div>
  );
}
