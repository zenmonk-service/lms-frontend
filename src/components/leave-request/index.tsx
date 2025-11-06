"use client";

import React, { useEffect, useState } from "react";
import DataTable from "../table";
import { useAppDispatch, useAppSelector } from "@/store";
import { getLeaveRequestsAction } from "@/features/leave-requests/leave-requests.action";
import { getSession } from "@/app/auth/get-auth.action";
import MakeLeaveRequest from "./make-leave-request";

const LeaveRequest = () => {
  const [session, setSession] = useState<any>(null);
  const { leaveRequests, isLoading } = useAppSelector(
    (state) => state.leaveRequestSlice
  );

  const currentOrganizationUuid = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );
  const dispatch = useAppDispatch();

  async function getUserUuid() {
    const session = await getSession();
    setSession(session);
  }

  useEffect(() => {
    getUserUuid();
    dispatch(
      getLeaveRequestsAction({
        org_uuid: currentOrganizationUuid,
        user_uuid: session?.user?.uuid,
      })
    );
  }, []);

  return (
    <div>
      <MakeLeaveRequest />
    </div>
  );
};

export default LeaveRequest;
