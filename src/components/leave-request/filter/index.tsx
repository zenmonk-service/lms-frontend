import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LeaveRequestStatus } from "@/features/leave-requests/leave-requests.types";
import { useAppDispatch, useAppSelector } from "@/store";
import { DatePicker } from "./date-picker";
import { useForm, Controller } from "react-hook-form";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserLeaveRequestsAction } from "@/features/leave-requests/leave-requests.action";
import { RotateCcw, X } from "lucide-react";

interface FilterProps {
  open: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}

interface FilterFormData {
  leave_type_uuid: string;
  status: string;
  manager_uuid: string;
  date: Date | undefined;
}

export function Filter({ open, onClose, onOpenChange }: FilterProps) {
  const [session, setSession] = useState<any>(null);

  const { leaveTypes } = useAppSelector((state) => state.leaveTypeSlice);
  const { users } = useAppSelector((state) => state.userSlice);

  const currentOrganizationUuid = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );
  const dispatch = useAppDispatch();

  async function getUserUuid() {
    const session = await getSession();
    setSession(session);
  }

  const { control, handleSubmit, reset, setValue } = useForm<FilterFormData>({
    defaultValues: {
      leave_type_uuid: "",
      status: "",
      manager_uuid: "",
      date: undefined,
    },
  });

  useEffect(() => {
    getUserUuid();
  }, [session?.user?.uuid]);

  const transformDate = (date?: Date) => {
    if (!date) return {};
    return {
      date: date.toLocaleDateString(),
    };
  };

  const handleReset = () => {
    reset();
    if (session)
      dispatch(
        getUserLeaveRequestsAction({
          org_uuid: currentOrganizationUuid,
          user_uuid: session?.user?.uuid,
        })
      );
    onClose();
  };

  const onSubmit = async (data: FilterFormData) => {
    const transformedDate = transformDate(data.date);

    const payload = {
      leave_type_uuid: data.leave_type_uuid,
      status: data.status,
      manager_uuid: data.manager_uuid,
      ...transformedDate,
    };

    if (session)
      dispatch(
        getUserLeaveRequestsAction({
          org_uuid: currentOrganizationUuid,
          user_uuid: session?.user?.uuid,
          ...payload,
        })
      );
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex flex-col"
        >
          <SheetHeader>
            <SheetTitle>Filter Leave Requests</SheetTitle>
            <SheetDescription>
              Use the filters below to narrow down your leave requests.
            </SheetDescription>
            <div className="flex w-full justify-end">
              <Button
                type="button"
                variant={"ghost"}
                size="icon-sm"
                onClick={handleReset}
              >
                <RotateCcw height={20} width={20} />
              </Button>
            </div>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Controller
                name="leave_type_uuid"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-xs">
                          Leave Type
                        </SelectLabel>
                        {leaveTypes.rows.map((type) => (
                          <SelectItem key={type.uuid} value={type.uuid}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-3">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-xs">
                          Leave Status
                        </SelectLabel>
                        {Object.entries(LeaveRequestStatus).map(
                          ([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-3">
              <Controller
                name="manager_uuid"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select by manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-xs">Manager</SelectLabel>
                        {users.map((type) => (
                          <SelectItem key={type.user_id} value={type.user_id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-3">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline" type="button">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
