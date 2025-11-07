"use client";
import { getSession } from "@/app/auth/get-auth.action";
import { getLeaveRequestsAction } from "@/features/leave-requests/leave-requests.action";
import { useAppDispatch, useAppSelector } from "@/store";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import DataTable, { PaginationState } from "../../table";
import { LeaveRequest, useLeaveRequestsColumns } from "./approve-leave-requests-columns";

export default function ApproveLeaveRequests() {
  const dispatch = useAppDispatch();
  const { userLeaveRequests, isLoading } = useAppSelector(
    (state) => state.leaveRequestSlice
  );
  console.log('userLeaveRequests: ', userLeaveRequests);
  console.log('leaveRequests: ', userLeaveRequests);

  const currentOrgUUID = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );

  const [session, setSession] = useState<Session | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    search: "",
  });

  async function setUserSession() {
    const userSession = await getSession();
    setSession(userSession);
  }

  useEffect(() => {
    setUserSession();
  }, []);

  useEffect(() => {
    if (currentOrgUUID && session?.user?.uuid) {
      dispatch(
        getLeaveRequestsAction({
          org_uuid: currentOrgUUID,
          manager_uuid: session.user.uuid,
          page: pagination.page,
          limit: pagination.limit,
          search: pagination.search,
        })
      );
    }
  }, [dispatch, currentOrgUUID, session, pagination]);

  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  const handleApprove = (lr: LeaveRequest) => {
    console.log("Approve (stub) ->", lr.uuid);
    // implement dispatch or API call later
  };
  const handleReject = (lr: LeaveRequest) => {
    console.log("Reject (stub) ->", lr.uuid);
    // implement dispatch or API call later
  };
  const handleRecommend = (lr: LeaveRequest) => {
    console.log("Recommend (stub) ->", lr.uuid);
    // implement dispatch or API call later
  };

  const columns = useLeaveRequestsColumns({
    onApprove: handleApprove,
    onReject: handleReject,
    onRecommend: handleRecommend,
  });

  return (
    <div>
      <DataTable
        data={userLeaveRequests?.rows ?? []}
        columns={columns}
        isLoading={isLoading}
        totalCount={userLeaveRequests?.count ?? 0}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        searchPlaceholder="Filter leave requests..."
        title="Pending Leave Requests"
        description="Approve, reject or recommend leave requests assigned to you."
        noDataMessage="No leave requests found."
      />
    </div>
  );
}
