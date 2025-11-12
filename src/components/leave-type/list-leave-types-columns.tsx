import { ColumnDef } from "@tanstack/react-table";
import { Info, LoaderCircle, MoreHorizontal, Pencil } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import {
  activateLeaveTypeAction,
  deactivateLeaveTypeAction,
  getLeaveTypesAction,
} from "@/features/leave-types/leave-types.action";
import { getSession } from "@/app/auth/get-auth.action";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export type LeaveTypes = {
  uuid: string;
  name: string;
  code: string;
  description: string;
  applicable_for: {
    type: "string";
    value: string[];
  };
  max_consecutive_days: number | null;
  allow_negative_leaves: boolean;
  accrual: {
    period: string;
    leave_count: string;
    applicable_on: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

const DescriptionCell = ({ value }: { value: string }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <Info className="cursor-pointer" height={20} width={20} />
    </HoverCardTrigger>
    <HoverCardContent align="start" className="w-full max-w-80">
      <div className="flex space-y-1">
        <p className="text-sm break-words">{value}</p>
      </div>
    </HoverCardContent>
  </HoverCard>
);

const renderApplicableFor = (
  applicableFor: LeaveTypes["applicable_for"],
  getRole: (roleUuid: string) => any
) => {
  const roles = applicableFor.value.map((roleUuid) => getRole(roleUuid)?.name);
  return <span>{roles?.join(", ")}</span>;
};

export const useLeaveTypesColumns = (
  onEdit?: (leaveType: LeaveTypes) => void,
  org_uuid?: string
): ColumnDef<LeaveTypes>[] => {
  const [session, setSession] = useState<any>(null);

  const { isLoading } = useAppSelector((state) => state.leaveTypeSlice);
  const { roles } = useAppSelector((state) => state.rolesSlice);
  const dispatch = useAppDispatch();

  function getRole(roleUuid: string) {
    return roles.find((role: any) => role.uuid === roleUuid);
  }

  async function getUserUuid() {
    const session = await getSession();
    setSession(session);
  }

  async function handleUpdateLeaveType() {
    if (org_uuid) {
      await dispatch(
        getLeaveTypesAction({
          org_uuid,
        })
      );
    }
  }

  const handleActiveToggle = async (
    isActive: boolean,
    leave_type_uuid: string
  ) => {
    if (isActive) {
      await dispatch(
        deactivateLeaveTypeAction({
          org_uuid,
          leave_type_uuid,
        })
      );
    } else {
      await dispatch(
        activateLeaveTypeAction({
          org_uuid,
          leave_type_uuid,
        })
      );
    }
    await handleUpdateLeaveType();
  };

  useEffect(() => {
    async function fetchUserLeaves() {
      await getUserUuid();
    }
    fetchUserLeaves();
  }, [session?.user?.uuid]);

  return [
    {
      id: "active_inactive",
      enableHiding: false,
      cell: ({ row }) => {
        const leaveType = row.original;
        const isActive: boolean = leaveType.is_active;
        const leave_type_uuid = leaveType.uuid;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Switch
                  checked={isActive}
                  className="data-[state=checked]:bg-orange-500"
                  onClick={() => handleActiveToggle(isActive, leave_type_uuid)}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>{isActive ? "Active" : "Inactive"}</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span>{row.getValue("code")}</span>,
    },
    {
      accessorKey: "name",
      header: "Leave Type Name",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <DescriptionCell value={row.getValue("description") as string} />
      ),
    },
    {
      accessorKey: "accrual",
      header: "Type",
      cell: ({ row }) => {
        const accrual = row.getValue("accrual") as LeaveTypes["accrual"];
        return (
          <Badge variant={"outline"}>
            {accrual?.period
              ? accrual?.period.charAt(0).toUpperCase() +
                accrual?.period.slice(1)
              : "No Accrual"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "applicable_for",
      header: "Applicable For",
      cell: ({ row }) => {
        const applicableFor = row.getValue(
          "applicable_for"
        ) as LeaveTypes["applicable_for"];
        return renderApplicableFor(applicableFor, getRole);
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const dateStr = row.getValue("created_at") as string;
        const date = new Date(dateStr);
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: "actions",
      header: () => {
        return (
          <div className="text-center hidden">
            <span>Actions</span>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit?.(row.original)}
                >
                  {isLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Pencil height={16} width={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Leave Request</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
