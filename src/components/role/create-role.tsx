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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  createOrganizationRoleAction,
  getOrganizationRolesAction,
} from "@/features/role/role.action";

type FormData = {
  name: string;
  description: string;
};

export default function CreateRole({ org_uuid }: { org_uuid: string }) {
  const dispatch = useAppDispatch();
  const { pagination } = useAppSelector((state) => state.rolesSlice);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    await dispatch(createOrganizationRoleAction({ ...data, org_uuid }));
    dispatch(
      getOrganizationRolesAction({
        org_uuid: org_uuid,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          search: pagination.search?.trim(),
        },
      })
    );
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r w-full from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-3 rounded-xl font-semibold flex items-center space-between gap-2"
      >
        <UserPlus className="w-5 h-5" />
        Create Role
      </Button>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 shadow-2xl rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="space-y-3 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Create Role
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 text-lg">
              Add a new role by providing its name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 max-h-96 overflow-y-auto pr-2">
            {/* Role Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-orange-500" /> Role Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter role name"
                {...register("name", { required: true })}
                className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm hover:shadow-md"
              />
              {errors.name && (
                <p className="text-xs text-red-500">Role name is required</p>
              )}
            </div>
            {/* Role Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-orange-500" /> Description *
              </Label>
              <Input
                id="description"
                placeholder="Enter role description"
                {...register("description", { required: true })}
                className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm hover:shadow-md"
              />
              {errors.description && (
                <p className="text-xs text-red-500">Description is required</p>
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
              Create Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
