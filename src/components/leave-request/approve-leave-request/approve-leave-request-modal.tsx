// File: src/features/leave-requests/components/LeaveActionModal.tsx
"use client";

import React, { useEffect, useState } from "react";

export type LeaveAction = "approve" | "reject" | "recommend" | null;

export interface LeaveActionModalProps {
  open: boolean;
  action: LeaveAction;
  initialRemark?: string;
  submitting?: boolean;
  onClose: () => void;

  onConfirm: (remark: string) => Promise<void> | void;
}

export default function LeaveActionModal({
  open,
  action,
  initialRemark = "",
  submitting = false,
  onClose,
  onConfirm,
}: LeaveActionModalProps) {
  const [remark, setRemark] = useState(initialRemark);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (open) setRemark(initialRemark);
  }, [open, initialRemark, action]);

  if (!open || !action) return null;

  const title =
    action === "approve"
      ? "Approve Leave Request"
      : action === "reject"
      ? "Reject Leave Request"
      : "Recommend Leave Request";

  const buttonText =
    action === "approve" ? "Approve" : action === "reject" ? "Reject" : "Recommend";

  const isLoading = submitting || localLoading;

  const handleConfirm = async () => {
    try {
      setLocalLoading(true);
      await Promise.resolve(onConfirm(remark));
      onClose();
    } catch (err) {
      console.error("LeaveActionModal onConfirm error:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please add remarks (optional). This will be saved for this manager's decision.
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
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            onClick={handleConfirm}
            type="button"
            disabled={isLoading}
          >
            {isLoading ? `${buttonText}...` : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
