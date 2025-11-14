"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Check,
  X,
  ThumbsUp,
  Info,
  ClockIcon,
  XIcon,
  CheckIcon,
  TrendingUpIcon,
  AlertCircleIcon,
} from "lucide-react";
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
  status?: LeaveRequestStatus;
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
      <HoverCardContent align="start" className="w-full max-w-80">
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
      header: () => {
        return (
          <div className="text-center">
            <span>Type</span>
          </div>
        );
      },
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <div className="flex justify-center">
            <Badge variant={"outline"} className="rounded-sm">
              {type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => {
        return (
          <div className="text-center">
            <span>Status</span>
          </div>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("status") as LeaveRequestStatus;
        let variant:
          | "default"
          | "destructive"
          | "secondary"
          | "outline"
          | "success";
        switch (value) {
          case LeaveRequestStatus.APPROVED:
            variant = "success";
            break;
          case LeaveRequestStatus.REJECTED:
            variant = "destructive";
            break;
          case LeaveRequestStatus.PENDING:
            variant = "secondary";
            break;
          case LeaveRequestStatus.CANCELLED:
            variant = "outline";
            break;
          case LeaveRequestStatus.RECOMMENDED:
            variant = "default";
            break;
          default:
            variant = "outline";
        }
        return (
          <div className="flex justify-center">
            <Badge variant={variant} className="rounded-sm">
              {variant === "secondary" && <ClockIcon />}
              {variant === "destructive" && <XIcon />}
              {variant === "success" && <CheckIcon />}
              {variant === "default" && <TrendingUpIcon />}
              {variant === "outline" && <AlertCircleIcon />}
              {value}
            </Badge>
          </div>
        );
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
              onClick={() => onApprove && onApprove(lr)}
              title="Approve"
            >
              <Check className="mr-1" size={14} /> Approve
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onReject && onReject(lr)}
              title="Reject"
            >
              <X className="mr-1" size={14} /> Reject
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => onRecommend && onRecommend(lr)}
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
