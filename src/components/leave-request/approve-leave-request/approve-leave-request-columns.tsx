"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, ThumbsUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { LeaveRequestStatus } from "@/features/leave-requests/leave-requests.types";

export type LeaveRequest = {
  uuid: string;
  id?: number;
  user?: {
    uuid?: string;
    name?: string;
    email?: string;
  };
  leave_type?: {
    uuid?: string;
    name?: string;
    code?: string;
  };
  start_date?: string;
  end_date?: string | null;
  type?: string;
  range?: string;
  leave_duration?: number | null;
  reason?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
};


const ReasonCell = ({ value }: { value?: string | null }) => {
  if (!value) return <span>-</span>;
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Info className="cursor-pointer" height={18} width={18} />
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80">
        <div>
          <p className="text-sm break-words">{value}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};


export const useLeaveRequestsColumns = (opts?: {
  onApprove?: (lr: LeaveRequest) => void;
  onReject?: (lr: LeaveRequest) => void;
  onRecommend?: (lr: LeaveRequest) => void;
}): ColumnDef<LeaveRequest>[] => {
  const { onApprove, onReject, onRecommend } = opts || {};

  return [
    {
      accessorKey: "leave_type.name",
      header: "Leave Type",
      cell: ({ row }) => <span>{row.original.leave_type?.name ?? "-"}</span>,
    },
    {
      accessorKey: "user.name",
      header: "Employee",
      cell: ({ row }) => (
        <div>
          <div>{row.original.user?.name ?? "—"}</div>
          <div className="text-xs opacity-70">
            {row.original.user?.email ?? ""}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "start_date",
      header: "Start",
      cell: ({ row }) => {
        const s = row.original.start_date;
        return <span>{s ? new Date(s).toLocaleDateString() : "-"}</span>;
      },
    },
    {
      accessorKey: "end_date",
      header: "End",
      cell: ({ row }) => {
        const e = row.original.end_date;
        return <span>{e ? new Date(e).toLocaleDateString() : "-"}</span>;
      },
    },
    {
      accessorKey: "leave_duration",
      header: "Duration (days)",
      cell: ({ row }) => <span>{row.original.leave_duration ?? "-"}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.type ?? "-"}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status ?? "UNKNOWN";
        const colorVariant =
          status.toLowerCase() === "approved"
            ? "default"
            : status.toLowerCase() === "rejected"
            ? "destructive"
            : "secondary";
        return <Badge variant="outline">{status}</Badge>;
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => <ReasonCell value={row.original.reason ?? ""} />,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const lr = row.original;
        const isPending = lr.status === LeaveRequestStatus.PENDING;

        return isPending ? (
          <div className="flex gap-2 items-center">
            <Button
              size="sm"
              onClick={() =>
                onApprove
                  ? onApprove(lr)
                  : console.log("Approve clicked", lr.uuid)
              }
              title="Approve"
            >
              <Check className="mr-1" size={14} /> Approve
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                onReject ? onReject(lr) : console.log("Reject clicked", lr.uuid)
              }
              title="Reject"
            >
              <X className="mr-1" size={14} /> Reject
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                onRecommend
                  ? onRecommend(lr)
                  : console.log("Recommend clicked", lr.uuid)
              }
              title="Recommend"
            >
              <ThumbsUp className="mr-1" size={14} /> Recommend
            </Button>
          </div>
        ) : (
          <span>-</span>
        );
      },
    },
  ];
};
