"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UserPlus, Mail, Lock, User, Users, EditIcon } from "lucide-react";
import { createUser, updateUser } from "@/features/user/user.service";
import {
  setIsUserExist,
  setPagination,
  UserInterface,
} from "@/features/user/user.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { getOrganizationRolesAction } from "@/features/role/role.action";
import { isUserExistAction, listUserAction } from "@/features/user/user.action";

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
  const isUserPresent = useAppSelector((state) => state.userSlice.isUserExist);

  const [selectedRole, setSelectedRole] = useState(
    isEdited ? (userData ? userData.role.uuid : "") : ""
  );
  const [open, setOpen] = useState(false);

  // Dynamically build schema based on isUserPresent
  const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: isEdited
      ? z.string().optional()
      : z.string().email("Enter a valid email address"),
    password:
      isUserPresent || isEdited
        ? z.string().optional()
        : z.string().min(1, "Password is required"),
    role: z.string().min(1, "Role is required"),
  });

  type FormData = z.infer<typeof userSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: isEdited && userData ? userData.name : "",
      email: isEdited && userData ? userData.email : "",
      password: "",
      role: isEdited && userData ? userData.role.uuid : "",
    },
  });

  const emailValue = watch("email");

  const onSubmit = async (data: FormData) => {
    if (isEdited && userData) {
      await updateUser({
        name: data.name,
        role: data.role,
        user_uuid: userData.user_id,
        org_uuid: org_uuid,
      });
      dispatch(
        listUserAction({ org_uuid, pagination: { page: 1, limit: 10 } })
      );
      dispatch(setPagination({ page: 1, limit: 10 }));
      setOpen(false);
    } else {
      await createUser({
        name: data.name,
        email: data.email?.trim() || "",
        // only send password when user is NOT already present
        ...(!isUserPresent && { password: data.password ?? "" }),
        org_uuid,
        role_uuid: data.role,
        role: "user",
      });
      dispatch(
        listUserAction({ org_uuid, pagination: { page: 1, limit: 10 } })
      );
      dispatch(setPagination({ page: 1, limit: 10 }));
      setOpen(false);
    }
    reset();
    setSelectedRole("");
  };

  useEffect(() => {
    if (open) {
      dispatch(getOrganizationRolesAction({ org_uuid }));
    }
  }, [org_uuid, open, dispatch]);

  useEffect(() => {
    if (
      emailValue &&
      !isEdited &&
      userSchema.shape.email.safeParse(emailValue).success
    ) {
      dispatch(isUserExistAction(emailValue.trim()));
    }
  }, [emailValue, isEdited, dispatch, userSchema.shape.email]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        reset();
        dispatch(setIsUserExist(false));
      }}
    >
      <Button
        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
        size="sm"
        onClick={() => setOpen(true)}
      >
        {isEdited ? (
          <>
            <EditIcon className="w-5 h-5" /> Edit User
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" /> Create User
          </>
        )}
      </Button>

      <DialogContent className="sm:max-w-[650px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEdited ? "Edit User" : "Create User"}</DialogTitle>
            <DialogDescription>
              {isEdited
                ? "Edit the user's details and assign a new role."
                : "Add a new user by providing their details and assigning a role."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 overflow-y-auto max-h-96 no-scrollbar py-2">
            {/* Full Name */}
            <Field data-invalid={!!errors.name} className="gap-1">
              <FieldLabel htmlFor="user-name">Full Name</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="user-name"
                  placeholder="Enter user's full name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                <InputGroupAddon>
                  <InputGroupText>
                    <User className="w-4 h-4 text-orange-500" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>Enter the user's full name.</FieldDescription>
              {errors.name && (
                <FieldError errors={[errors.name]} className="text-xs" />
              )}
            </Field>

            {/* Email (only when creating and not editing) */}
            {!isEdited && (
              <Field data-invalid={!!errors.email} className="gap-1">
                <FieldLabel htmlFor="user-email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="user-email"
                    type="email"
                    placeholder="user@example.com"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  <InputGroupAddon>
                    <InputGroupText>
                      <Mail className="w-4 h-4 text-orange-500" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Provide a valid email address for the user.
                </FieldDescription>
                {errors.email && (
                  <FieldError errors={[errors.email]} className="text-xs" />
                )}
              </Field>
            )}

            {/* Password (only when creating and user is not present) */}
            {!isEdited && !isUserPresent && (
              <Field data-invalid={!!errors.password} className="gap-1">
                <FieldLabel htmlFor="user-password">Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="user-password"
                    type="password"
                    placeholder="Enter password"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <InputGroupAddon>
                    <InputGroupText>
                      <Lock className="w-4 h-4 text-orange-500" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Set an initial password for the user.
                </FieldDescription>
                {errors.password && (
                  <FieldError errors={[errors.password]} className="text-xs" />
                )}
              </Field>
            )}

            {/* Role Selection */}
            <Field data-invalid={!!errors.role} className="gap-1">
              <FieldLabel>Assign Role</FieldLabel>
              <Select
                value={selectedRole}
                onValueChange={(val) => {
                  setSelectedRole(val);
                  setValue("role", val, { shouldValidate: true });
                  trigger("role");
                }}
              >
                <SelectTrigger
                  className={
                    errors.role
                      ? "border-destructive ring-destructive focus-visible:ring-destructive text-destructive"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role: any) => (
                    <SelectItem key={role.uuid} value={role.uuid}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Choose a role to define the user&apos;s permissions.
              </FieldDescription>
              {errors.role && (
                <FieldError errors={[errors.role]} className="text-xs" />
              )}
              {selectedRole && (
                <p className="text-xs text-green-600 mt-1">
                  {roles.find((r: any) => r.uuid === selectedRole)?.description}
                </p>
              )}
            </Field>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
            >
              {isEdited ? "Edit User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
