"use client";

import React, { useEffect, useState } from "react";
import DataTable, { PaginationState } from "@/shared/table";
import { useAppDispatch, useAppSelector } from "@/store";
import { getUserLeaveRequestsAction } from "@/features/leave-requests/leave-requests.action";
import { getSession } from "@/app/auth/get-auth.action";
import MakeLeaveRequest from "./make-leave-request";
import { useLeaveRequestColumns } from "./leave-request-columns";
import { LeaveRequestStatus } from "@/features/leave-requests/leave-requests.types";
import { DateRangePicker } from "@/shared/date-range-picker";

import CustomSelect from "@/shared/select";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "../ui/multi-select";

const LeaveRequest = () => {
  const [session, setSession] = useState<any>(null);
  const { users } = useAppSelector((state) => state.userSlice);

  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("");
  const [managerFilter, setManagerFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRangeFilter, setDateRangeFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");

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
      const data = {
        leave_type_uuid: leaveTypeFilter || undefined,
        manager_uuid: managerFilter || undefined,
        status: statusFilter || undefined,
        date_range: dateRangeFilter || undefined,
        date: dateFilter || undefined,
      };
      console.log("Fetching leaves with data:", data);
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
    dateFilter,
  ]);

  const columns = useLeaveRequestColumns();

  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  return (
    <div>
      <MakeLeaveRequest />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4 ">
          <div>
            <h2 className="text-lg font-semibold">All Leave Requests</h2>
            <p className="text-sm text-muted-foreground">
              List of all leave requests made by users.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <CustomSelect
              value={leaveTypeFilter}
              onValueChange={setLeaveTypeFilter}
              data={leaveTypes.rows}
              label="Leave Type"
              placeholder="Leave type"
              className="w-[180px]"
            />
          </div>

          <div>
            <MultiSelect values={managerFilter} onValuesChange={setManagerFilter}>
              <MultiSelectTrigger className="w-[180px]">
                <MultiSelectValue placeholder="Select managers..." />
              </MultiSelectTrigger>
              <MultiSelectContent
                search={{
                  emptyMessage: "No manager found.",
                  placeholder: "Search managers...",
                }}
              >
                <MultiSelectGroup>
                  {users.map((manager) => (
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
              setDate={setDateFilter}
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
        />
      </div>
    </div>
  );
};

export default LeaveRequest;
