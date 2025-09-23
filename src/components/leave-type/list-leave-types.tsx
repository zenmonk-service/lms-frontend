// components/leave-type/ListLeaveTypes.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { getLeaveTypesAction } from "@/features/leave-types/leave-types.action";

/**
 * Simple ListLeaveTypes component.
 * - Calls getLeaveTypesAction(org_uuid) in useEffect
 * - Reads leave types from common slice locations (be tolerant to shape)
 * - Renders minimal card list
 */

export default function ListLeaveTypes({
  orgUuid = "b1eebc91-9c0b-4ef8-bb6d-6bb9bd380a22",
}: {
  orgUuid?: string;
}) {
  const dispatch = useAppDispatch();

  // Dispatch to fetch list
  useEffect(() => {
    dispatch(getLeaveTypesAction({ org_uuid: orgUuid }));
  }, [dispatch, orgUuid]);

  // Try a few common locations for the leave types list in the store.
  // Using any here to avoid strict typing issues — adapt to your real slice shape if you want.
  const state: any = useAppSelector((s: any) => s);

  // possible places your slice might keep the list
  const leaveTypes =
    state.leaveTypesSlice?.items ||
    state.leaveTypesSlice?.list ||
    state.leaveTypes?.items ||
    state.organizations?.leaveTypes ||
    state.organizations?.data ||
    state.leaveTypes ||
    [];

  const loading =
    state.leaveTypesSlice?.loading ||
    state.leaveTypes?.loading ||
    state.organizations?.loading ||
    false;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">All Leave Types</h2>
          <p className="text-sm text-muted-foreground">
            List of configured leave types for the organization.
          </p>
        </div>

        {/* optional quick actions area */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dispatch(getLeaveTypesAction({ org_uuid: orgUuid }))}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 min-h-[160px]">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : !leaveTypes ||
          (Array.isArray(leaveTypes) && leaveTypes.length === 0) ? (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">
              No leave types found.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaveTypes.map((lt: any, idx: number) => (
              <div
                key={lt.uuid || lt.id || idx}
                className="border rounded p-3 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {lt.name || lt.title || "Unnamed"}
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      {lt.code || lt.short_code || ""}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {renderApplicableFor(
                      lt.applicable_for ||
                        lt.applicableFor ||
                        lt.applicableRoles
                    )}
                  </div>
                </div>

                {lt.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lt.description}
                  </p>
                ) : null}

                {lt.accrual || lt.accrual_period ? (
                  <div className="mt-3 text-sm">
                    <div>
                      Period: {lt.accrual?.period || lt.accrual_period || "-"}
                    </div>
                    <div>
                      Leave count:{" "}
                      {lt.accrual?.leave_count ?? lt.leave_count ?? "-"}
                    </div>
                  </div>
                ) : null}

                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                  <Button size="sm">Duplicate</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderApplicableFor(val: any) {
  if (!val) return "All";
  // if it's the { type: 'role', value: 'all' } structure
  if (val.value === "all") return "All roles";
  if (Array.isArray(val.value)) return `${val.value.length} role(s)`;
  if (Array.isArray(val)) return `${val.length} role(s)`;
  return String(val.value ?? val);
}
