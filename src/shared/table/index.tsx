"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LoaderCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

export interface PaginationState {
  page: number;
  limit: number;
  search: string;
}

interface DataTableProps {
  data: any[];
  columns: any[];
  isLoading: boolean;
  searchable?: boolean;
  totalCount: number;
  pagination: PaginationState;
  onPaginationChange: (newPagination: Partial<PaginationState>) => void;
  searchPlaceholder?: string;
  noDataMessage?: string;
}

export default function DataTable({
  data,
  columns,
  isLoading,
  searchable = true,
  totalCount,
  pagination,
  onPaginationChange,
  searchPlaceholder = "Search...",
  noDataMessage = "No data available.",
}: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchDebounced = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      handleSearchChange(value);
    }, 500);
  };

  const handleSearchChange = (value: string) => {
    if (value?.trim() === pagination.search) return;
    onPaginationChange({ search: value, page: 1 });
  };

  const handlePageSizeChange = (newLimit: number) => {
    onPaginationChange({ limit: newLimit, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    onPaginationChange({ page: newPage });
  };

  return (
    <>
      {/* Search */}
      <div className="flex items-center justify-between mb-4">
        {searchable && (
          <Input
            placeholder={searchPlaceholder}
            onChange={(event) => handleSearchDebounced(event.target.value)}
            className="max-w-sm mt-4"
          />
        )}
      </div>

      {/* Table Container */}
      <div className="bg-background border border-border rounded-lg p-4 max-h-[calc(100vh-220px)] overflow-auto flex flex-col justify-between">
        <div className="relative overflow-auto rounded-md border border-border">
          <Table>
            {/* Header */}
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* Body */}
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center p-8"
                  >
                    <div className="flex justify-center items-center">
                      <LoaderCircle className="animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !data || data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center p-8 text-muted-foreground"
                  >
                    {noDataMessage}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50"
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

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-4 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Select Page Size:
            </span>
            <Select
              onValueChange={(val) => handlePageSizeChange(Number(val))}
              value={pagination.limit.toString()}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-xs">
                    Page Size
                  </SelectLabel>
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
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= totalCount}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
