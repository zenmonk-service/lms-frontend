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
import { Plus, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getRoles } from "@/features/organizations/organizations.service";
import { addRoles } from "@/features/role/role.slice";
import { createLeaveTypeAction } from "@/features/organizations/organizations.action";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// single schema (simplified)
const leaveTypeSchema = z.object({
  name: z.string().min(2, "Leave Type name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  applicableRoles: z.array(z.string()).optional(),
  // simplified accrual options
  accrualFrequency: z.enum(["none", "monthly", "yearly"]).optional(),
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
      accrualFrequency: "none",
      leaveCount: "",
    },
  });

  const organizationRoles = selector.roles || [];
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const getData = async () => {
    const org_uuid = "b1eebc91-9c0b-4ef8-bb6d-6bb9bd380a22";
    const response = await getRoles(org_uuid);
    dispatch(addRoles(response.data));
  };

  useEffect(() => {
    getData();
  }, []);

  // helper: remove keys that are null/undefined (or optionally empty string)
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

  // transformFormData (updated)
  function transformFormData(data: any, availableRoles: any[]) {
    const selected = (data.applicableRoles || []).map((id: string) =>
      id.trim()
    );

    const availableUuids = (availableRoles || []).map((r: any) => r.uuid);

    const applicable_for = {
      type: "role",
      value: selected.length === availableUuids.length ? "all" : selected,
    };

    // map frontend accrualFrequency -> backend period values (adjust if you import a shared enum)
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
              period, // <-- renamed from frequency to period
              applicable_on: "start_of_month", // hard-coded as requested
              leave_count:
                data.leaveCount !== "" && data.leaveCount !== undefined
                  ? Number(data.leaveCount)
                  : null,
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

  // Ideally get org_uuid from store/context; kept hardcoded per your example
  const org_uuid = "b1eebc91-9c0b-4ef8-bb6d-6bb9bd380a22";

  const onSubmit = async (values: LeaveTypeFormData) => {
    console.log("values: ", values);
    const transformed = transformFormData(values, organizationRoles);
    const payload = { ...transformed, org_uuid };

    const resultAction = await dispatch(createLeaveTypeAction(payload));
    if (createLeaveTypeAction.fulfilled.match(resultAction)) {
      console.log("✅ Leave type created:", resultAction.payload);
      reset();
    } else {
      console.error("❌ Create leave type failed:", resultAction.payload);
    }
  };

  // preview watchers
  const accrualFrequency = watch("accrualFrequency");
  const leaveCount = watch("leaveCount");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <Plus className="w-5 h-5" /> Create Leave Type
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200">
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
                {...register("leaveCount")}
                type="number"
                step="0.5"
                min="0"
                placeholder="Leave count (e.g. 2.5)"
              />

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
