"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { getLeaveTypesAction } from "@/features/leave-types/leave-types.action";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LeaveTypes, useLeaveTypesColumns } from "./list-leave-types-columns";
import LeaveTypeForm from "./leave-type-form";
import { LoaderCircle } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ListLeaveTypes() {
  const dispatch = useAppDispatch();
  const { leaveTypes, isLoading } = useAppSelector(
    (state) => state.leaveTypeSlice
  );

  const currentOrgUUID = useAppSelector((state) => state.userSlice.currentOrganizationUuid);


  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypes | null>(
    null
  );
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  const handleEdit = (leaveType: LeaveTypes) => {
    setSelectedLeaveType(leaveType);
    setEditDialogOpen(true);
  };

  const columns = useLeaveTypesColumns(handleEdit);

  const table = useReactTable({
    data: leaveTypes.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    dispatch(
      getLeaveTypesAction({
        org_uuid: currentOrgUUID,
        page,
        limit,
        search,
      })
    );
  }, [dispatch, currentOrgUUID, page, limit]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">All Leave Types</h2>
          <p className="text-sm text-muted-foreground">
            List of configured leave types for the organization.
          </p>
          <Input
            placeholder="Filter emails..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm mt-4"
          />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 min-h-[160px]">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-[#eaeef1]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="text-[#707483] font-medium"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center p-8"
                  >
                    <div className="flex justify-center items-center">
                      <LoaderCircle
                        className="animate-spin"
                        width={20}
                        height={20}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !leaveTypes ||
                (Array.isArray(leaveTypes.rows) &&
                  leaveTypes.rows.length === 0) ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center p-8"
                  >
                    No leave types found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Select Page Size:</span>
            <Select
              onValueChange={(val) => {
                const newPageSize = Number(val);
                setLimit(newPageSize);
                setPage(1);
                dispatch(
                  getLeaveTypesAction({
                    org_uuid: currentOrgUUID,
                    page,
                    limit: newPageSize,
                  })
                );
              }}
              value={limit.toString()}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-xs">Page Size</SelectLabel>
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= leaveTypes.count}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {selectedLeaveType && (
        <LeaveTypeForm
          label="edit"
          data={{
            name: selectedLeaveType.name,
            code: selectedLeaveType.code,
            description: selectedLeaveType.description,
            applicableRoles: selectedLeaveType.applicable_for.value,
            accrualFrequency: selectedLeaveType.accrual?.period as any,
            leaveCount: selectedLeaveType.accrual?.leave_count,
          }}
          leave_type_uuid={selectedLeaveType.uuid}
          isOpen={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedLeaveType(null);
          }}
        />
      )}
    </div>
  );
}
