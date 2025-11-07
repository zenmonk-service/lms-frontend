"use client";

import React, { useEffect, useState } from "react";
import DataTable, { PaginationState } from "../table";
import { useAppDispatch, useAppSelector } from "@/store";
import { getUserLeaveRequestsAction } from "@/features/leave-requests/leave-requests.action";
import { getSession } from "@/app/auth/get-auth.action";
import MakeLeaveRequest from "./make-leave-request";
import { useLeaveRequestColumns } from "./leave-request-columns";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";
import { Filter } from "./filter";

const LeaveRequest = () => {
  const [session, setSession] = useState<any>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const { userLeaveRequests, isLoading } = useAppSelector(
    (state) => state.leaveRequestSlice
  );
  const currentOrganizationUuid = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    search: "",
  });
  const dispatch = useAppDispatch();

  async function getUserUuid() {
    const session = await getSession();
    setSession(session);
  }

  const onOpenChange = (open: boolean) => {
    setFilterOpen(open);
  };

  const onClose = () => {
    setFilterOpen(false);
  };

  useEffect(() => {
    async function fetchUserLeaves() {
      await getUserUuid();
      if (session)
        dispatch(
          getUserLeaveRequestsAction({
            org_uuid: currentOrganizationUuid,
            user_uuid: session?.user?.uuid,
            page: pagination.page,
            limit: pagination.limit,
            search: pagination.search,
          })
        );
    }
    fetchUserLeaves();
  }, [session?.user?.uuid, pagination, dispatch, currentOrganizationUuid]);

  const columns = useLeaveRequestColumns();

  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  return (
    <div>
      <MakeLeaveRequest />
      <div className="p-6">
        <div className="w-full flex justify-end gap-4">
          <Button
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
            size="sm"
            onClick={() => onOpenChange(true)}
          >
            <ListFilter height={20} width={20} />
            Filter
          </Button>
        </div>

        <Filter
          open={filterOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
        />

        <DataTable
          data={userLeaveRequests.rows || []}
          columns={columns}
          isLoading={isLoading}
          searchable={false}
          totalCount={userLeaveRequests.count || 0}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          searchPlaceholder="Filter your leave requests..."
          title="All Leave Requests"
          description="List of leave requests for the organization."
          noDataMessage="No leave requests found."
        />
      </div>
    </div>
  );
};

export default LeaveRequest;
