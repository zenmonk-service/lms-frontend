"use client";

import React, { useEffect, useState } from "react";
import DataTable, { PaginationState } from "@/shared/table";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  deleteLeaveRequestOfUserAction,
  getUserLeaveRequestsAction,
} from "@/features/leave-requests/leave-requests.action";
import { getSession } from "@/app/auth/get-auth.action";
import MakeLeaveRequest from "./make-leave-request";
import { useLeaveRequestColumns } from "./leave-request-columns";
import { LeaveRequestStatus } from "@/features/leave-requests/leave-requests.types";
import { DateRangePicker } from "@/shared/date-range-picker";

import CustomSelect from "@/shared/select";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "../ui/multi-select";
import { LeaveRequestModal } from "./leave-request-modal";
import { ConfirmationDialog } from "@/shared/confirmation-dialog";
import { type LeaveRequest } from "./approve-leave-request/approve-leave-request-columns";

const LeaveRequest = () => {
  const [session, setSession] = useState<any>(null);
  const { users, currentUser } = useAppSelector((state) => state.userSlice);

  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("");
  const [managerFilter, setManagerFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRangeFilter, setDateRangeFilter] = useState<{
    start_date?: string;
    end_date?: string;
  }>({
    start_date: undefined,
    end_date: undefined,
  });

  const [data, setData] = useState<LeaveRequest>();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedLeaveRequestUuid, setSelectedLeaveRequestUuid] = useState<
    string | null
  >(null);

  const { userLeaveRequests, isLoading } = useAppSelector(
    (state) => state.leaveRequestSlice
  );
  const { leaveTypes } = useAppSelector((state) => state.leaveTypeSlice);

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
  useEffect(() => {
    async function fetchUserLeaves() {
      await getUserUuid();
      let date_range = undefined;
      if (dateRangeFilter.start_date && dateRangeFilter.end_date) {
        date_range = [dateRangeFilter.start_date, dateRangeFilter.end_date];
      }

      const data = {
        leave_type_uuid: leaveTypeFilter || undefined,
        managers: managerFilter || undefined,
        status: statusFilter || undefined,
        date_range: date_range,
        date: date_range ? undefined : dateRangeFilter.start_date,
      };
      if (session)
        dispatch(
          getUserLeaveRequestsAction({
            org_uuid: currentOrganizationUuid,
            user_uuid: session?.user?.uuid,
            page: pagination.page,
            limit: pagination.limit,
            search: pagination.search,
            ...data,
          })
        );
    }
    fetchUserLeaves();
  }, [
    session?.user?.uuid,
    pagination,
    dispatch,
    currentOrganizationUuid,
    leaveTypeFilter,
    managerFilter,
    statusFilter,
    dateRangeFilter,
  ]);

  const onEdit = (row: any) => {
    setData(row);
    setModalOpen(true);
  };

  const onDelete = async (leave_request_uuid: string) => {
    setSelectedLeaveRequestUuid(leave_request_uuid);
    setConfirmationOpen(true);
  };

  const columns = useLeaveRequestColumns({
    onEdit,
    onDelete,
  });

  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  return (
    <div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold">All Leave Requests</h2>
            <p className="text-sm text-muted-foreground">
              List of all leave requests made by users.
            </p>
          </div>
          <MakeLeaveRequest />
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <CustomSelect
              value={leaveTypeFilter}
              onValueChange={setLeaveTypeFilter}
              data={leaveTypes.rows.filter((lt) => lt.is_active)}
              label="Leave Type"
              placeholder="Leave type"
              className="w-[180px]"
            />
          </div>

          <div>
            <MultiSelect
              values={managerFilter}
              onValuesChange={setManagerFilter}
            >
              <MultiSelectTrigger className="w-[180px] hover:bg-transparent">
                <MultiSelectValue
                  overflowBehavior="cutoff"
                  placeholder="Select managers"
                />
              </MultiSelectTrigger>
              <MultiSelectContent
                search={{
                  emptyMessage: "No manager found.",
                  placeholder: "Search managers...",
                }}
              >
                <MultiSelectGroup>
                  {users
                    .filter(
                      (manager) => manager.user_id !== currentUser?.user_id
                    )
                    .map((manager) => (
                      <MultiSelectItem
                        value={manager.user_id}
                        key={manager.user_id}
                      >
                        {manager.name}
                      </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </div>

          <div>
            <CustomSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              data={LeaveRequestStatus}
              isEnum={true}
              label="Leave Status"
              placeholder="Status"
              className="w-[180px]"
            />
          </div>

          <div>
            <DateRangePicker
              setDateRange={setDateRangeFilter}
              isDependant={false}
            />
          </div>
        </div>
        <DataTable
          data={userLeaveRequests.rows || []}
          columns={columns}
          isLoading={isLoading}
          searchable={false}
          totalCount={userLeaveRequests.count || 0}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          noDataMessage="No leave request found."
        />

        <ConfirmationDialog
          open={confirmationOpen}
          onOpenChange={setConfirmationOpen}
          description="This action cannot be undone. This will permanently delete this leave request."
          handleConfirm={async () => {
            await dispatch(
              deleteLeaveRequestOfUserAction({
                user_uuid: currentUser?.user_id,
                leave_request_uuid: selectedLeaveRequestUuid,
              })
            );
            await dispatch(
              getUserLeaveRequestsAction({
                org_uuid: currentOrganizationUuid,
                user_uuid: session?.user?.uuid,
              })
            );
          }}
        />

        <LeaveRequestModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onClose={() => setModalOpen(false)}
          data={data}
          leave_request_uuid={data?.uuid}
        />
      </div>
    </div>
  );
};

export default LeaveRequest;
