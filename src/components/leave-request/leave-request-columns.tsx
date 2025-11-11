import { ColumnDef } from "@tanstack/react-table";
import { NotepadText } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Badge } from "../ui/badge";
import { LeaveRequestStatus } from "@/features/leave-requests/leave-requests.types";

interface LeaveRequest {
  uuid: string;
  start_date: string;
  end_date: string;
  type: string;
  range: string;
  leave_duration: string;
  reason: string;
  status: LeaveRequestStatus;
  leave_type: {
    name: string;
    uuid: string;
  };
  managers: {
    remarks: string | null;
    user: {
      user_id: string;
      name: string;
      email: string;
    };
  }[];
}

const RemarkCell = ({ value }: { value: string }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <NotepadText className="cursor-pointer" height={20} width={20} />
    </HoverCardTrigger>
    <HoverCardContent align="start" className="w-auto">
      <div className="flex space-y-1">
        <p className="text-sm break-words">{value}</p>
      </div>
    </HoverCardContent>
  </HoverCard>
);

export const useLeaveRequestColumns = (): ColumnDef<LeaveRequest>[] => {
  return [
    {
      accessorKey: "leave_type",
      header: "Leave Type",
      cell: ({ row }) => {
        const leave_type = row.getValue(
          "leave_type"
        ) as LeaveRequest["leave_type"];
        return <span>{leave_type.name}</span>;
      },
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => <span>{row.getValue("start_date")}</span>,
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row }) => <span>{row.getValue("end_date")}</span>,
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
            <Badge variant={"outline"}>
              {type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "range",
      header: () => {
        return (
          <div className="text-center">
            <span>Range</span>
          </div>
        );
      },
      cell: ({ row }) => {
        const range = row.getValue("range") as string;
        return (
          <div className="flex justify-center">
            <Badge variant={"outline"}>
              {range
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
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
            variant = "destructive";
            break;
          case LeaveRequestStatus.RECOMMENDED:
            variant = "default";
            break;
          default:
            variant = "outline";
        }
        return (
          <div className="flex justify-center">
            <Badge variant={variant}>{value}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "managers",
      header: "Manager",
      cell: ({ row }) => {
        const managers = row.getValue("managers") as LeaveRequest["managers"];
        const user = managers.map((manager) => manager.user.name).join(", ");
        return <span>{user || "-"}</span>;
      },
    },
    {
      accessorKey: "managers.remarks",
      header: "Remark",
      cell: ({ row }) => {
        const managers = row.getValue("managers") as LeaveRequest["managers"];
        const remark = managers.find((manager) => manager.remarks);
        return <RemarkCell value={remark?.remarks || "No Remark"} />;
      },
    },
  ];
};
