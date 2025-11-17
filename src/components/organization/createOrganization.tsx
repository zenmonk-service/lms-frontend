// Refactored CreateOrganizationForm using Field, InputGroup, Dialog-style UI

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const orgSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  domain: z.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format").optional().optional(),
  website: z.string().url("Invalid website URL").optional(),
  description: z.string().optional(),
});

type OrgFormValues = z.infer<typeof orgSchema>;

export default function CreateOrganizationForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (data: OrgFormValues) => void;
  isSubmitting?: boolean;
}) {
  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      domain: "",
      website: "",
      description: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 p-2 max-h-[75vh] overflow-y-auto">
      {/* Organization Name */}
      <Field className="gap-1" data-invalid={!!form.formState.errors.name}>
        <FieldLabel>Organization Name</FieldLabel>
        <Input
          {...form.register("name")}
          placeholder="e.g. ZenMonk Technologies"
          className="bg-gray-50 border border-gray-200 rounded-xl"
        />
        {form.formState.errors.name && (
          <FieldError errors={[form.formState.errors.name]} />
        )}
      </Field>

      {/* Domain */}
      <Field className="gap-1" data-invalid={!!form.formState.errors.domain}>
        <FieldLabel>Domain</FieldLabel>
        <Input
          {...form.register("domain")}
          placeholder="e.g. zenmonk.com"
          className="bg-gray-50 border border-gray-200 rounded-xl"
        />
        {form.formState.errors.domain && (
          <FieldError errors={[form.formState.errors.domain]} />
        )}
      </Field>

      {/* Website */}
      <Field className="gap-1" data-invalid={!!form.formState.errors.website}>
        <FieldLabel>Website</FieldLabel>
        <Input
          {...form.register("website")}
          placeholder="https://zenmonk.com"
          className="bg-gray-50 border border-gray-200 rounded-xl"
        />
        {form.formState.errors.website && (
          <FieldError errors={[form.formState.errors.website]} />
        )}
      </Field>

      {/* Description */}
      <Field className="gap-1" data-invalid={!!form.formState.errors.description}>
        <FieldLabel>Description</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            {...form.register("description")}
            placeholder="Short description about your organization"
            rows={4}
            className="resize-none bg-gray-50 border border-gray-200 rounded-xl"
          />
          <InputGroupAddon align="block-end">
            <InputGroupText className="tabular-nums">
              {(form.watch("description")?.length || 0)}/500
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Briefly describe the organization.</FieldDescription>
        {form.formState.errors.description && (
          <FieldError errors={[form.formState.errors.description]} />
        )}
      </Field>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Organization"}
      </Button>
    </form>
  );
}
