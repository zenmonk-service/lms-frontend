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
  DialogTrigger,
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
import {
  Plus,
  Calendar,
  Code,
  FileText,
  Users,
  Clock,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getRoles } from "@/features/organizations/organizations.service";
import { addRoles } from "@/features/role/role.slice";
import { createLeaveTypeAction } from "@/features/organizations/organizations.action";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const leaveTypeSchema = z.object({
  name: z.string().min(2, "Leave Type name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  applicableRoles: z.array(z.string()).optional(),
  maxConsecutiveDays: z.union([z.string(), z.number()]).optional(),
  allowNegativeLeaves: z.boolean().optional(),
  period: z.string().optional(),
  applicableOn: z.string().optional(),
  leaveCount: z.union([z.string(), z.number()]).optional(),
});

type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>;

export default function CreateLeaveType() {
  const selector = useAppSelector((state) => state.rolesSlice);
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
    defaultValues: {
      name: "",
      code: "",
      description: "",
      applicableRoles: [],
      maxConsecutiveDays: "",
      allowNegativeLeaves: false,
      period: "",
      applicableOn: "",
      leaveCount: "",
    },
  });

  const organizationRoles = selector.roles || [];
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const getData = async () => {
    const org_uuid = "6a013782-b61e-4232-b878-f844e784946e";
    const response = await getRoles(org_uuid);
    dispatch(addRoles(response.data));
  };

  useEffect(() => {
    getData();
  }, []);

  // Transform to backend-friendly payload
  function transformFormData(data: any, availableRoles: any[]) {
    const selected = (data.applicableRoles || []).map((id: string) =>
      id.trim()
    );

    const availableUuids = (availableRoles || []).map((r: any) => r.uuid);

    const applicable_for = {
      type: "role",
      value: selected.length === availableUuids.length ? "all" : selected,
    };

    const accrual =
      data.period || data.applicableOn || data.leaveCount
        ? {
            period: data.period || null,
            applicable_on: data.applicableOn || null,
            leave_count:
              data.leaveCount !== "" && data.leaveCount !== undefined
                ? Number(data.leaveCount)
                : null,
          }
        : null;

    return {
      name: data.name?.trim(),
      code: data.code?.trim()?.toUpperCase(),
      description: data.description?.trim() || null,
      applicable_for,
      max_consecutive_days:
        data.maxConsecutiveDays === "" || data.maxConsecutiveDays === undefined
          ? null
          : Number(data.maxConsecutiveDays),
      allow_negative_leaves: !!data.allowNegativeLeaves,
      accrual,
    };
  }

  // Ideally get org_uuid from store/context; kept hardcoded per your example
  const org_uuid = "17365071-58d0-4a6e-bc27-2d9df26c114f";

  const onSubmit = async (values: LeaveTypeFormData) => {
    const transformed = transformFormData(values, organizationRoles);
    const payload = { ...transformed, org_uuid };

    // dispatch thunk
    const resultAction = await dispatch(createLeaveTypeAction(payload));
    if (createLeaveTypeAction.fulfilled.match(resultAction)) {
      // success
      console.log("✅ Leave type created:", resultAction.payload);
      reset();
      // You may want to close the dialog or show a toast here
    } else {
      // failure
      console.error("❌ Create leave type failed:", resultAction.payload);
      // Show an error toast or set server errors in form if needed
    }
  };

  // preview watchers
  const period = watch("period");
  const applicableOn = watch("applicableOn");
  const leaveCount = watch("leaveCount");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <Plus className="w-5 h-5" /> Create Leave Type
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200">
        {/* Single form element only */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="space-y-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                Create Leave Type
              </DialogTitle>
            </div>
            <DialogDescription>
              Configure a new leave type with custom rules and settings.
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
              <Label>Select Applicable Roles</Label>
              <div className="grid grid-cols-2 gap-2">
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
              </div>
            </div>

            {/* Max Consecutive Days */}
            <div>
              <Label htmlFor="maxConsecutiveDays">Max Consecutive Days</Label>
              <Input
                {...register("maxConsecutiveDays")}
                type="number"
                min={1}
              />
            </div>

            {/* Allow Negative Leaves */}
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="allowNegativeLeaves"
                render={({ field }) => (
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={(val) => field.onChange(!!val)}
                  />
                )}
              />
              <Label>Allow Negative Leave Balance</Label>
            </div>

            {/* Accrual Config */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Period */}
              <Controller
                control={control}
                name="period"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Applicable On */}
              <Controller
                control={control}
                name="applicableOn"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Start Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="join_date">Employee Join Date</SelectItem>
                      <SelectItem value="calendar_year">Calendar Year</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Leave Count */}
              <Input
                {...register("leaveCount")}
                type="number"
                step="0.5"
                min="0"
                placeholder="2.5"
              />
            </div>

            {(period || applicableOn || leaveCount) && (
              <div className="mt-2 p-3 border border-orange-200 rounded">
                Preview: {leaveCount && `${leaveCount} days`}{" "}
                {period && `accrued ${period}`}
                {applicableOn && `, starting from ${applicableOn}`}
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Leave Type</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
