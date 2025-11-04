"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Mail, Lock, User, Users } from "lucide-react";
import { createUser } from "@/features/user/user.service";

const roles = [
  {
    uuid: "b2c3d4e5-6a78-4f2b-9a4d-0b1c23456789",
    name: "Chief Technology Officer (CTO)",
    description:
      "Oversees technical strategy, architecture decisions and engineering organisation.",
    role_level: 2,
  },
  {
    uuid: "c1d2e3f4-7b89-4a3c-8a5e-1c2d34567890",
    name: "HR Manager",
    description:
      "Manages employee lifecycle, policies, onboarding and HR workflows.",
    role_level: 3,
  },
  {
    uuid: "d4e5f6a7-8c90-4b4d-9b6f-2d3e45678901",
    name: "Finance Manager",
    description:
      "Responsible for billing, payroll, budgets and financial approvals.",
    role_level: 3,
  },
  {
    uuid: "e5f6a7b8-9d01-4c5e-8c7a-3e4f56789012",
    name: "Engineering Manager",
    description:
      "Leads engineering teams, handles planning, delivery and people management.",
    role_level: 4,
  },
  {
    uuid: "f6a7b8c9-0e12-4d6f-9d8b-4f5067890123",
    name: "Team Lead",
    description:
      "Technical lead for a team; assigns tasks, mentors and reviews code.",
    role_level: 5,
  },
  {
    uuid: "07a8b9c0-1f23-4e70-8e9c-506178901234",
    name: "Software Engineer",
    description: "Implements features, fixes bugs and contributes to the codebase.",
    role_level: 6,
  },
  {
    uuid: "18b9c0d1-2a34-4f81-9fab-617289012345",
    name: "Contractor",
    description:
      "Short-term contributor with limited system access for contracted work.",
    role_level: 7,
  },
];

type FormData = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export default function CreateUser({org_uuid}: {org_uuid: string}) {
  const [selectedRole, setSelectedRole] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    createUser({ ...data , org_uuid: org_uuid });
    console.log("Form submitted:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Create User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 shadow-2xl rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="space-y-3 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Create User
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 text-lg">
              Add a new user by providing their details and assigning a role.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 max-h-96 overflow-y-auto pr-2">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-orange-500" /> Full Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter user's full name"
                {...register("name", { required: true })}
                className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm hover:shadow-md"
              />
              {errors.name && (
                <p className="text-xs text-red-500">Name is required</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-orange-500" /> Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register("email", { required: true })}
                className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm hover:shadow-md"
              />
              {errors.email && (
                <p className="text-xs text-red-500">Email is required</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-orange-500" /> Password *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register("password", { required: true })}
                className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm hover:shadow-md"
              />
              {errors.password && (
                <p className="text-xs text-red-500">Password is required</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" /> Assign Role *
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(val) => {
                  setSelectedRole(val);
                  setValue("role", val);
                }}
              >
                <SelectTrigger className="w-full border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm hover:shadow-md p-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-lg rounded-xl">
                  {roles.map((role) => (
                    <SelectItem key={role.uuid} value={role.uuid}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-red-500">Role is required</p>
              )}
              {selectedRole && (
                <p className="text-xs text-orange-600 mt-1">
                  {roles.find((r) => r.uuid === selectedRole)?.description}
                </p>
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
            >
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
