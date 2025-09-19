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
import z from "zod";

export default function CreateLeaveType() {

  const leaveTypeSchema = z.object({
    name: z.string().min(2, "Leave Type name is required"),
    code: z.string().optional(),
    description: z.string().optional(),
    applicableRoles: z.string().optional(),
    maxConsecutiveDays: z.number()
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [period, setPeriod] = useState("");
  const [applicableOn, setApplicableOn] = useState("");
  const [leaveCount, setLeaveCount] = useState("");
  const selector = useAppSelector((state) => state.rolesSlice);
  const dispatch = useAppDispatch();
  const organizationROles = selector.roles;
  console.log('organizationROles: ', organizationROles);

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const getData = async () => {
    const org_uuid = "17365071-58d0-4a6e-bc27-2d9df26c114f";
    const response = await getRoles(org_uuid);
    dispatch(addRoles(response.data));
  };

  useEffect(() => {
    getData();
  }, []);

function handleCreateLeaveType() {
  dispatch(createLeaveTypeAction({}))
}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-3 rounded-xl font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Leave Type
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Create Leave Type
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-lg">
            Configure a new leave type with custom rules and settings. Required
            fields are marked with an asterisk.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 max-h-96 overflow-y-auto pr-2">
          {/* Name */}
          <div className="group space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Leave Type Name *
              </Label>
            </div>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Annual Leave, Sick Leave, Personal Time Off"
              required
              className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            />
          </div>

          {/* Code */}
          <div className="group space-y-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-orange-500" />
              <Label
                htmlFor="code"
                className="text-sm font-semibold text-gray-700"
              >
                Unique Code *
              </Label>
            </div>
            <Input
              id="code"
              name="code"
              placeholder="e.g., AL, SL, PTO (uppercase recommended)"
              required
              className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            />
          </div>

          {/* Description */}
          <div className="group space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-gray-700"
              >
                Description
              </Label>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the purpose and usage of this leave type..."
              className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md resize-none"
              rows={3}
            />
          </div>

          {/* Applicable For */}
          <div className="group space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <Label
                htmlFor="applicable_for"
                className="text-sm font-semibold text-gray-700"
              >
                Applicable For
              </Label>
            </div>
            <div className="space-y-3">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">
                  Select Applicable Roles
                </Label>
                <div className="border-2 border-orange-200 rounded-xl bg-white/70 backdrop-blur-sm p-4 max-h-32 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {organizationROles?.map((role) => (
                      <div
                        key={role.uuid}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={role.uuid}
                          checked={selectedRoles.includes(role.uuid)}
                          onCheckedChange={() => handleRoleToggle(role.uuid)}
                          className="border-2 border-orange-400 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label
                          htmlFor={role.uuid}
                          className="text-sm text-gray-700 cursor-pointer hover:text-orange-600"
                        >
                          {role.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedRoles.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-orange-200">
                      <p className="text-xs text-orange-600 font-medium">
                        Selected:{" "}
                        {organizationROles &&
                          organizationROles
                            .filter((role) => selectedRoles.includes(role.id))
                            .map((role) => role.name)
                            .join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Max Consecutive Days */}
          <div className="group space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <Label
                htmlFor="max_consecutive_days"
                className="text-sm font-semibold text-gray-700"
              >
                Max Consecutive Days
              </Label>
            </div>
            <Input
              id="max_consecutive_days"
              name="max_consecutive_days"
              type="number"
              placeholder="e.g., 15 (leave blank for unlimited)"
              className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
              min="1"
            />
          </div>

          {/* Allow Negative Leaves */}
          <div className="group">
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-orange-100/50 to-amber-100/50 border-2 border-orange-200 hover:shadow-md transition-all duration-200">
              <Checkbox
                id="allow_negative_leaves"
                name="allow_negative_leaves"
                className="border-2 border-orange-400 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <Label
                htmlFor="allow_negative_leaves"
                className="text-sm font-semibold text-gray-700 cursor-pointer"
              >
                Allow Negative Leave Balance
              </Label>
            </div>
          </div>

          {/* Accrual Configuration */}
          <div className="group space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500" />
              <Label className="text-sm font-semibold text-gray-700">
                Accrual Configuration
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Period Selection (ShadCN Select) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">
                  Accrual Period
                </Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-full border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm hover:shadow-md p-3">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-0">
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Applicable On Date (ShadCN Select) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">
                  Applicable From
                </Label>
                <Select value={applicableOn} onValueChange={setApplicableOn}>
                  <SelectTrigger className="w-full border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm hover:shadow-md p-3">
                    <SelectValue placeholder="Select start date" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-0">
                    <SelectItem value="join_date">
                      Employee Join Date
                    </SelectItem>
                    <SelectItem value="calendar_year">
                      Calendar Year Start
                    </SelectItem>
                    <SelectItem value="financial_year">
                      Financial Year Start
                    </SelectItem>
                    <SelectItem value="custom_date">Custom Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Leave Count */}
              <div className="space-y-2">
                <Label
                  htmlFor="leave_count"
                  className="text-sm font-medium text-gray-600"
                >
                  Leave Count
                </Label>
                <Input
                  id="leave_count"
                  type="number"
                  step="0.5"
                  min="0"
                  value={leaveCount}
                  onChange={(e) => setLeaveCount(e.target.value)}
                  placeholder="e.g., 2.5"
                  className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                />
              </div>
            </div>

            {/* Configuration Preview */}
            {(period || applicableOn || leaveCount) && (
              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
                <h4 className="text-sm font-semibold text-orange-700 mb-2">
                  Configuration Preview:
                </h4>
                <p className="text-sm text-gray-700">
                  {leaveCount && `${leaveCount} days`}
                  {period && ` accrued ${period}`}
                  {applicableOn &&
                    `, starting from ${applicableOn.replace("_", " ")}`}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-6 border-t border-orange-200/50">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 rounded-xl px-6 py-2 font-semibold transition-all duration-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl px-8 py-2 font-semibold"
            onClick={handleCreateLeaveType}
          >
            Create Leave Type
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
