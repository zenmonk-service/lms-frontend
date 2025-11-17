"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Permission } from "@/features/permissions/permission.slice";
import { Loader } from "lucide-react";

export default function RolePermissionForm({
  permissions,
  selectedPermissions = [],
  onSave,
  isLoading = false,
}: {
  permissions: Permission[];
  selectedPermissions?: Permission[];
  onSave: (permissionIds: string[]) => void;
  isLoading?: boolean;
}) {
  const grouped = permissions.reduce<Record<string, Permission[]>>(
    (acc, perm) => {
      acc[perm.tag] = acc[perm.tag] || [];
      acc[perm.tag].push(perm);
      return acc;
    },
    {}
  );

  const [selected, setSelected] = useState(
    new Set(selectedPermissions.map((perm) => perm.uuid))
  );

  useEffect(() => {
    setSelected(new Set(selectedPermissions.map((perm) => perm.uuid)));
  }, [selectedPermissions]);

  const togglePermission = (id: string) => {
    const updated = new Set(selected);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelected(updated);
  };

  return isLoading ? (
    <div className="flex items-center justify-center h-[400px]">
      <Loader />
    </div>
  ) : (
    <>
      <div className="space-y-6 h-full pb-1 overflow-y-auto no-scrollbar">
        {Object.entries(grouped).map(([group, perms]) => (
          <Card key={group}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {/* Use a ref to set indeterminate manually */}

                <CardTitle className="capitalize">
                  {group.replace(/_/g, " ")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-wrap gap-4">
              <div className="flex gap-2">
                {perms.map((permission) => (
                  <label
                    key={permission.uuid}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={selected.has(permission.uuid)}
                      onCheckedChange={() => togglePermission(permission.uuid)}
                    />
                    <span>{permission.action}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end items-center gap-2.5">
                <label
                  className="flex items-center space-x-2 cursor-pointer underline"
                  htmlFor={`select-all-${group}`}
                >
                  Select All
                </label>
                <Checkbox
                  id={`select-all-${group}`}
                  checked={perms.every((permission) =>
                    selected.has(permission.uuid)
                  )}
                  ref={(el) => {
                    const input = el as HTMLInputElement | null;
                    if (input) {
                      input.indeterminate =
                        perms.some((permission) =>
                          selected.has(permission.uuid)
                        ) &&
                        !perms.every((permission) =>
                          selected.has(permission.uuid)
                        );
                    }
                  }}
                  onCheckedChange={(checked) => {
                    const updated = new Set(selected);
                    if (checked) {
                      perms.forEach((permission) =>
                        updated.add(permission.uuid)
                      );
                    } else {
                      perms.forEach((permission) =>
                        updated.delete(permission.uuid)
                      );
                    }
                    setSelected(updated);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        disabled={isLoading}
        onClick={() => onSave(Array.from(selected))}
        className="w-full cursor-pointer"
      >
        {isLoading ? <Loader /> : "Save Permissions"}
      </Button>
    </>
  );
}
