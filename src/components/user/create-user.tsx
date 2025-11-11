"use client";

import { useEffect, useState } from "react";
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
import { UserPlus, Mail, Lock, User, Users, EditIcon } from "lucide-react";
import { createUser, updateUser } from "@/features/user/user.service";
import { setPagination, UserInterface } from "@/features/user/user.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { getOrganizationRolesAction } from "@/features/role/role.action";
import { listUserAction } from "@/features/user/user.action";
import { da } from "date-fns/locale";

type FormData = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export default function CreateUser({
  org_uuid,
  isEdited = false,
  userData,
}: {
  org_uuid: string;
  isEdited?: boolean;
  userData?: UserInterface;
}) {
  const dispatch = useAppDispatch();
  const roles = useAppSelector((state) => state.rolesSlice.roles);
  const [selectedRole, setSelectedRole] = useState(
    isEdited ? (userData ? userData.role.uuid : "") : ""
  );
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: isEdited && userData ? userData.name : "",
      email: isEdited && userData ? userData.email : "",
      role: isEdited && userData ? userData.role.uuid : "",
    },
  });
  const emailValue = watch("email");
  const isUserPresent = useAppSelector((state) => state.userSlice.total);
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (isEdited && userData) {
      await updateUser({
        ...data,
        user_uuid: userData.user_id,
        org_uuid: org_uuid,
      });

      dispatch(
        listUserAction({
          org_uuid: org_uuid,
          pagination: { page: 1, limit: 10 },
        })
      );
      dispatch(setPagination({ page: 1, limit: 10 }));
      setOpen(false);
    } else {
      await createUser({
        ...data,
        org_uuid: org_uuid,
        role_uuid: data.role,
        role: "user",
      });
      setOpen(false);
    }
    reset();
    setSelectedRole("");
  };

  useEffect(() => {
    dispatch(getOrganizationRolesAction({org_uuid: org_uuid}));
  }, []);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  console.log(isValidEmail(emailValue));
  useEffect(() => {
    if (isValidEmail(emailValue) && emailValue !== "" && !isEdited) {
      dispatch(
        listUserAction({
          org_uuid: "",
          pagination: { page: 1, limit: 10, search: emailValue?.trim() },
        })
      );
    }
  }, [emailValue]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r w-full from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-3 rounded-xl font-semibold flex items-center space-between gap-2"
      >
        {isEdited ? (
          <EditIcon className="w-5 h-5" />
        ) : (
          <UserPlus className="w-5 h-5" />
        )}
        {isEdited ? "Edit User" : "Create User"}
      </Button>

      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 shadow-2xl rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="space-y-3 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {isEdited ? "Edit User" : "Create User"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 text-lg">
              {isEdited
                ? "Edit the user's details and assign a new role."
                : "Add a new user by providing their details and assigning a role."}
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
            {!isEdited && (
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
            )}

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
                  {roles.map((role: any) => (
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
                  {roles.find((r: any) => r.uuid === selectedRole)?.description}
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
              {isEdited ? "Edit User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
