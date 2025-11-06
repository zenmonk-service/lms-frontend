"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getOrganizationRolesAction } from "@/features/role/role.action";
import {
  createLeaveTypeAction,
  getLeaveTypesAction,
  updateLeaveTypeAction,
} from "@/features/leave-types/leave-types.action";

const leaveTypeSchema = z.object({
  name: z.string().min(2, "Leave Type name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  applicableRoles: z
    .array(z.string())
    .min(1, "At least one role must be selected"),
  accrualFrequency: z.enum(["none", "monthly", "yearly"]),
  leaveCount: z.number().min(0, "Leave count must be a positive number"),
});

type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>;

interface LeaveTypeFormProps {
  label: "edit" | "create";
  data?: LeaveTypeFormData;
  leave_type_uuid?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export default function LeaveTypeForm({
  label,
  data,
  leave_type_uuid,
  isOpen,
  onOpenChange,
  onClose,
}: LeaveTypeFormProps) {
  const selector = useAppSelector((state) => state.rolesSlice);
  const { isLoading } = useAppSelector((state) => state.leaveTypeSlice);
  const dispatch = useAppDispatch();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeSchema),
  });

  const organizationRoles = selector.roles || [];
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const currentOrgUUID = useAppSelector(
    (state) => state.userSlice.currentOrganizationUuid
  );

  useEffect(() => {
    if (data && isOpen) {
      reset({
        name: data.name || "",
        code: data.code || "",
        description: data.description || "",
        applicableRoles: data.applicableRoles || [],
        accrualFrequency: data.accrualFrequency || "none",
        leaveCount: data.leaveCount ? Number(data.leaveCount) : 0,
      });

      setSelectedRoles(data.applicableRoles);
    } else if (!isOpen) {
      reset({
        name: "",
        code: "",
        description: "",
        applicableRoles: [],
        accrualFrequency: "none",
        leaveCount: 0,
      });
      setSelectedRoles([]);
    }
  }, [data, isOpen, reset, organizationRoles]);

  useEffect(() => {
    dispatch(getOrganizationRolesAction(currentOrgUUID));
  }, [currentOrgUUID]);

  function cleanObject<T extends Record<string, any>>(
    obj: T,
    keysToClean: string[] = []
  ) {
    const out = { ...obj };
    keysToClean.forEach((k) => {
      if (out[k] === null || out[k] === undefined || out[k] === "") {
        delete out[k];
      }
    });
    return out;
  }

  function transformFormData(data: any) {
    const selected = (data.applicableRoles || []).map((id: string) =>
      id.trim()
    );

    const applicable_for = {
      type: "role",
      value: selected,
    };

    const frequencyToPeriodMap: Record<string, string> = {
      monthly: "monthly",
      yearly: "yearly",
      quarterly: "quarterly",
      half_yearly: "half_yearly",
    };

    const period =
      data.accrualFrequency && data.accrualFrequency !== "none"
        ? frequencyToPeriodMap[data.accrualFrequency] || data.accrualFrequency
        : null;

    const accrual =
      period || (data.leaveCount !== "" && data.leaveCount !== undefined)
        ? cleanObject(
            {
              period,
              applicable_on: "start_of_month",
              leave_count: Number(data.leaveCount),
            },
            ["period", "applicable_on", "leave_count"]
          )
        : null;

    const payload = {
      name: data.name?.trim(),
      code: data.code?.trim()?.toUpperCase(),
      description: data.description?.trim() || null,
      applicable_for,
      accrual,
    };

    return payload;
  }

  const onSubmit = async (values: LeaveTypeFormData) => {
    const transformed = transformFormData(values);
    const payload =
      label === "create"
        ? { ...transformed, org_uuid: currentOrgUUID }
        : { ...transformed, org_uuid: currentOrgUUID, leave_type_uuid };

    try {
      if (label === "create") {
        await dispatch(createLeaveTypeAction(payload));
      } else {
        await dispatch(updateLeaveTypeAction(payload));
      }

      await dispatch(getLeaveTypesAction({ org_uuid: currentOrgUUID }));

      reset();
      setSelectedRoles([]);
      setValue("applicableRoles", []);
      onClose();
    } catch (error) {
      throw error;
    }
  };

  const accrualFrequency = watch("accrualFrequency");
  const leaveCount = watch("leaveCount");

  const toggleSelectAll = () => {
    const allUuids = (organizationRoles || []).map((r: any) => r.uuid);
    const currentlyAllSelected =
      selectedRoles.length === allUuids.length && allUuids.length > 0;

    if (currentlyAllSelected) {
      setSelectedRoles([]);
      setValue("applicableRoles", []);
    } else {
      setSelectedRoles(allUuids);
      setValue("applicableRoles", allUuids);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="space-y-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                {label === "create" ? "Create Leave Type" : "Edit Leave Type"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {label === "create"
                ? "Configure a new leave type with custom rules and settings."
                : "Edit the leave type with custom rules and settings."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 max-h-96 overflow-y-auto pr-2">
            {/* Name */}
            <div>
              <Label htmlFor="name">Leave Type Name *</Label>
              <Input {...register("name")} placeholder="Annual Leave" />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Code */}
            <div>
              <Label htmlFor="code">Unique Code *</Label>
              <Input {...register("code")} placeholder="AL" />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Describe leave type..."
              />
            </div>

            {/* Roles */}
            <div>
              <div className="flex items-center justify-between">
                <Label>Select Applicable Roles</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={toggleSelectAll}
                >
                  {selectedRoles.length ===
                  (organizationRoles || []).map((r: any) => r.uuid).length
                    ? "Clear"
                    : "Select All"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {organizationRoles?.map((role: any) => (
                  <div key={role.uuid} className="flex items-center space-x-2">
                    <Checkbox
                      id={role.uuid}
                      checked={selectedRoles.includes(role.uuid)}
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...selectedRoles, role.uuid]
                          : selectedRoles.filter((r) => r !== role.uuid);

                        setSelectedRoles(updated);
                        setValue("applicableRoles", updated);
                      }}
                    />
                    <label htmlFor={role.uuid} className="select-none">
                      {role.name}
                    </label>
                  </div>
                ))}
                {errors.applicableRoles && (
                  <p className="text-red-500 text-sm col-span-2">
                    {errors.applicableRoles.message}
                  </p>
                )}
              </div>
            </div>

            {/* Simplified Accrual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Controller
                control={control}
                name="accrualFrequency"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Accrual" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Accrual</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <Input
                {...register("leaveCount", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? 0 : Number(v)),
                })}
                type="number"
                step="0.5"
                min="0"
                placeholder="Leave count (e.g. 2.5)"
              />
              {errors.leaveCount && (
                <p className="text-red-500 text-sm">
                  {errors.leaveCount.message}
                </p>
              )}

              <div>
                {/* Preview */}
                {(accrualFrequency && accrualFrequency !== "none") ||
                leaveCount ? (
                  <div className="p-3 border border-orange-200 rounded">
                    Preview: {leaveCount && `${leaveCount} days`}{" "}
                    {accrualFrequency &&
                      accrualFrequency !== "none" &&
                      `accrued ${accrualFrequency}`}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer min-w-[150px]"
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : label === "edit" ? (
                "Update Leave Type"
              ) : (
                "Create Leave Type"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
