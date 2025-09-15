"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const orgSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  domain: z.string().optional(),
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem >
              <FormLabel>Organization Name</FormLabel>
              <FormControl className="mt-1">
                <Input className="border-0 outline-none" placeholder="e.g. ZenMonk Technologies" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl className="mt-1">
                <Input className="border-0 outline-none"  placeholder="e.g. zenmonk.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl className="mt-1">
                <Input className="border-0 outline-none"  placeholder="https://zenmonk.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl className="mt-1">
                <Textarea
                  placeholder="Short description about your organization"
                  className="resize-none border-0 outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-orange-500 text-white  " disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Organization"}
        </Button>
      </form>
    </Form>
  );
}
