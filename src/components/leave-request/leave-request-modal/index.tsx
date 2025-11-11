import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { getLeaveTypesAction } from "@/features/leave-types/leave-types.action";
import { useAppDispatch, useAppSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { getOrganizationRolesAction } from "@/features/role/role.action";
import {
  createUserLeaveRequestsAction,
  getUserLeaveRequestsAction,
} from "@/features/leave-requests/leave-requests.action";
import {
  LeaveRange,
  LeaveRequestType,
} from "@/features/leave-requests/leave-requests.types";
import { listUserAction } from "@/features/user/user.action";
import { DateRangePicker } from "@/shared/date-range-picker";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import CustomSelect from "@/shared/select";
import { LoaderCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSession } from "@/app/auth/get-auth.action";

interface LeaveRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const allowedRanges: Record<string, string[]> = {
  [LeaveRequestType.FULL_DAY]: [LeaveRange.FULL_DAY],
  [LeaveRequestType.HALF_DAY]: [LeaveRange.FIRST_HALF, LeaveRange.SECOND_HALF],
  [LeaveRequestType.SHORT_LEAVE]: [
    LeaveRange.FIRST_QUARTER,
    LeaveRange.SECOND_QUARTER,
    LeaveRange.THIRD_QUARTER,
    LeaveRange.FOURTH_QUARTER,
  ],
};

const leaveRequestSchema = z
  .object({
    leave_type_uuid: z
      .string()
      .trim()
      .nonempty({ error: "Please select a leave." }),
    type: z.string().nonempty({ error: "Please select a leave type." }),
    range: z.string().nonempty({ error: "Please select a leave range." }),
    managers: z
      .array(z.string())
      .min(1, "Atleast one manager needs to be selected."),
    reason: z
      .string()
      .trim()
      .min(10, "Reason must be at least 10 characters long")
      .max(500, "Reason must be at most 500 characters long"),
    date_range: z
      .object({
        start_date: z.string().nonempty("Start date is required."),
        end_date: z.string().nonempty("End date is required."),
      })
      .refine((r) => !!(r && r.start_date && r.end_date), {
        message: "Please select a date range.",
      }),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.date_range.start_date);
      const endDate = new Date(data.date_range.end_date);
      return startDate <= endDate;
    },
    {
      message: "End date must be after or equal to start date.",
      path: ["date_range"],
    }
  );

type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

export function LeaveRequestModal({
  open,
  onOpenChange,
  onClose,
}: LeaveRequestModalProps) {
  const { leaveTypes } = useAppSelector((state) => state.leaveTypeSlice);
  const currentOrganizationUuid = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );
  const { users } = useAppSelector((state) => state.userSlice);
  const { isLoading } = useAppSelector((state) => state.leaveRequestSlice);
  const dispatch = useAppDispatch();

  const { control, handleSubmit, reset, setValue } =
    useForm<LeaveRequestFormData>({
      resolver: zodResolver(leaveRequestSchema),
      defaultValues: {
        leave_type_uuid: "",
        reason: "",
        managers: [],
        date_range: { start_date: "", end_date: "" },
        type: "",
        range: "",
      },
    });

  const [type, setType] = useState<LeaveRequestType | "">("");
  const [range, setRange] = useState<LeaveRange | "">("");
  const [session, setSession] = useState<any>(null);

  async function getUserUuid() {
    const session = await getSession();
    setSession(session);
  }

  useEffect(() => {
    getUserUuid();
    dispatch(getLeaveTypesAction({ org_uuid: currentOrganizationUuid }));
    dispatch(getOrganizationRolesAction(currentOrganizationUuid));
    dispatch(
      listUserAction({
        pagination: { page: 1, limit: 10 },
        org_uuid: currentOrganizationUuid,
      })
    );
  }, []);

  useEffect(() => {
    if (type === "") {
      setRange("");
    }
    setValue("type", type as LeaveRequestType);
    setValue("range", range as LeaveRange);
  }, [type, range]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const onSubmit = async (data: LeaveRequestFormData) => {
    const dateRange = data.date_range;
    data = { ...data, ...dateRange };
    if (session) {
      await dispatch(
        createUserLeaveRequestsAction({
          org_uuid: currentOrganizationUuid,
          user_uuid: session?.user?.uuid,
          ...data,
        })
      );

      await dispatch(
        getUserLeaveRequestsAction({
          org_uuid: currentOrganizationUuid,
          user_uuid: session?.user?.uuid,
        })
      );
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>
              Fill in the form below to request leave.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 overflow-y-auto max-h-96 no-scrollbar py-2">
            <div className="grid gap-3">
              <Controller
                name="leave_type_uuid"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel>Leave Type</FieldLabel>
                    <CustomSelect
                      ref={field.ref}
                      value={field.value}
                      onValueChange={field.onChange}
                      data={leaveTypes.rows}
                      label="Leaves"
                      placeholder="Select a leave"
                      className={
                        fieldState.invalid
                          ? "border-destructive ring-destructive focus-visible:ring-destructive text-destructive"
                          : ""
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-xs"
                      />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="grid gap-3">
                <Controller
                  name="type"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel>Type</FieldLabel>
                      <CustomSelect
                        ref={field.ref}
                        value={type}
                        onValueChange={(val) =>
                          setType(val as LeaveRequestType)
                        }
                        data={LeaveRequestType}
                        isEnum={true}
                        label="Leave Type"
                        placeholder="Select leave type"
                        className={
                          fieldState.invalid
                            ? "border-destructive ring-destructive focus-visible:ring-destructive text-destructive"
                            : ""
                        }
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-3">
                <Controller
                  name="range"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel>Range</FieldLabel>
                      <Select
                        value={range}
                        onValueChange={(val) => setRange(val as LeaveRange)}
                      >
                        <SelectTrigger
                          ref={field.ref}
                          disabled={type === ""}
                          value={range}
                          onReset={() => setRange("")}
                          className={
                            fieldState.invalid
                              ? "border-destructive ring-destructive focus-visible:ring-destructive text-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder={"Select leave range"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="text-xs">
                              Leave Range
                            </SelectLabel>
                            {(
                              allowedRanges[type as LeaveRequestType] ?? []
                            ).map((val, index) => {
                              return (
                                <SelectItem key={index} value={val}>
                                  {val
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <Controller
                name="managers"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="gap-1 col-span-2"
                  >
                    <FieldLabel>Apply To</FieldLabel>
                    <MultiSelect
                      values={field.value}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectTrigger
                        ref={field.ref}
                        className={`w-full hover:bg-transparent ${
                          fieldState.invalid
                            ? "border-destructive ring-destructive focus-visible:ring-destructive text-destructive"
                            : ""
                        }`}
                      >
                        <MultiSelectValue
                          overflowBehavior="cutoff"
                          placeholder="Select managers..."
                        />
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
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-xs"
                      />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-3">
              <Controller
                name="date_range"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel>Date Range</FieldLabel>
                    <DateRangePicker
                      ref={field.ref}
                      minDate={today}
                      setDateRange={field.onChange}
                      className={
                        fieldState.invalid
                          ? "border-destructive ring-destructive focus-visible:ring-destructive text-destructive"
                          : ""
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-xs"
                      />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-3">
              <Controller
                name="reason"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="form-rhf-demo-reason">
                      Reason
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-rhf-demo-reason"
                        placeholder="I'm requesting leave because..."
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field?.value?.length || 0}/100 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      Briefly describe why you are requesting this leave.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Request Leave"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
