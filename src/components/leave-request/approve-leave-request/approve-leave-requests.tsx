"use client";
import { getSession } from "@/app/auth/get-auth.action";
import {
  getLeaveRequestsAction,
  approveLeaveRequestAction,
  recommendLeaveRequestAction,
  rejectLeaveRequestAction,
} from "@/features/leave-requests/leave-requests.action";
import { useAppDispatch, useAppSelector } from "@/store";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import DataTable, { PaginationState } from "../../table";
import {
  LeaveRequest,
  useLeaveRequestsColumns,
} from "./approve-leave-requests-columns";

type Mode = "approve" | "reject" | "recommend" | null;

export default function ApproveLeaveRequests() {
  const dispatch = useAppDispatch();
  const { userLeaveRequests, isLoading } = useAppSelector(
    (state) => state.leaveRequestSlice
  );

  const currentOrgUUID = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );

  const [session, setSession] = useState<Session | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    search: "",
  });

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<LeaveRequest | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [remark, setRemark] = useState("");

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

  const openModal = (lr: LeaveRequest, actionMode: Mode) => {
    setSelected(lr);
    setMode(actionMode);
    setRemark("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setMode(null);
    setRemark("");
  };

  const submitAction = async () => {
    if (!selected || !mode || !session?.user?.uuid) return;

    const payload = {
      leave_request_uuid: (selected as any).uuid,
      manager_uuid: session.user.uuid,
      remark,
    };

try {
  const payloadWithOrg = {
    ...payload,
    org_uuid: currentOrgUUID,
  };

  if (mode === "approve") {
    await dispatch(approveLeaveRequestAction(payloadWithOrg)).unwrap();
  } else if (mode === "reject") {
    await dispatch(rejectLeaveRequestAction(payloadWithOrg)).unwrap();
  } else if (mode === "recommend") {
    await dispatch(recommendLeaveRequestAction(payloadWithOrg)).unwrap();
  }
} catch (error) {
  console.error(error);
} finally {
      closeModal();
    }
  };

  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  const handleApprove = (lr: LeaveRequest) => openModal(lr, "approve");
  const handleReject = (lr: LeaveRequest) => openModal(lr, "reject");
  const handleRecommend = (lr: LeaveRequest) => openModal(lr, "recommend");

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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              {mode === "approve" && "Approve Leave Request"}
              {mode === "reject" && "Reject Leave Request"}
              {mode === "recommend" && "Recommend Leave Request"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please add remarks (optional). This will be saved for this
              manager's decision.
            </p>

            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={5}
              className="w-full mb-4 rounded border p-2"
              placeholder="Enter remarks (optional)"
            />

            <div className="flex justify-end gap-2">
              <button
                className="rounded border px-4 py-2"
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                onClick={submitAction}
                type="button"
              >
                {mode === "approve" && "Approve"}
                {mode === "reject" && "Reject"}
                {mode === "recommend" && "Recommend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
