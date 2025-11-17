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

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";

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
  const { pagination, isLoading } = useAppSelector((state) => state.rolesSlice);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const descriptionValue = watch("description");

  const onSubmit = async (data: FormData) => {
    await dispatch(createOrganizationRoleAction({ ...data, org_uuid }));

    dispatch(
      getOrganizationRolesAction({
        org_uuid,
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
        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
        size="sm"
      >
        <UserPlus className="w-5 h-5" />
        Create Role
      </Button>

      <DialogContent className="sm:max-w-[650px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
            <DialogDescription>
              Provide the role name and description to create a new role.
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="grid gap-4 overflow-y-auto max-h-96 no-scrollbar py-2">
            {/* Role Name */}
            <Field data-invalid={!!errors.name} className="gap-1">
              <FieldLabel>Role Name</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...register("name", { required: true })}
                  placeholder="Enter role name"
                  rows={1}
                  className="min-h-10 resize-none"
                />
              </InputGroup>
              {errors.name && (
                <FieldError
                  errors={[{ message: "Role name is required" }]}
                  className="text-xs"
                />
              )}
            </Field>

            {/* Role Description */}
            <Field data-invalid={!!errors.description} className="gap-1">
              <FieldLabel>Description</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...register("description", { required: true })}
                  placeholder="Enter description..."
                  rows={4}
                  className="min-h-20 resize-none"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {descriptionValue?.length || 0}/200
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              <FieldDescription>
                Describe the purpose of this role briefly.
              </FieldDescription>

              {errors.description && (
                <FieldError
                  errors={[{ message: "Description is required" }]}
                  className="text-xs"
                />
              )}
            </Field>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={isLoading}
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
            >
              {isLoading ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
