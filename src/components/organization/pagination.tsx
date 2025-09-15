import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PageToken = number | "ELLIPSIS";

interface AdminTablePaginationProps {
  total: number; // total number of items
  currentPage: number; // 1-based current page
  pageSize: number; // items per page
  onPageChange: (page: number) => void;
  siblingCount?: number; // how many pages to show on each side of current (default 1)
}

export function AdminTablePagination({
  total,
  currentPage,
  pageSize,
  onPageChange,
  siblingCount = 1,
}: AdminTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const ELLIPSIS_TOKEN: PageToken = "ELLIPSIS";

  /**
   * Build a compact list of pages where:
   * - First and last pages are always present.
   * - Pages in range [currentPage - siblingCount, currentPage + siblingCount] are present.
   * - Gaps are represented by ELLIPSIS_TOKEN.
   */
  const buildCompactPageList = (): PageToken[] => {
    // If total is small, show every page.
    const minPagesToShowAll = siblingCount * 2 + 5; // e.g., sibling=1 -> 7 pages
    if (totalPages <= minPagesToShowAll) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftBoundary = Math.max(2, currentPage - siblingCount);
    const rightBoundary = Math.min(totalPages - 1, currentPage + siblingCount);

    const pages: PageToken[] = [];
    pages.push(1); // first page

    // left-side gap
    if (leftBoundary > 2) {
      pages.push(ELLIPSIS_TOKEN);
    } else {
      // include page 2 when there is no left ellipsis
      for (let p = 2; p < leftBoundary; p++) pages.push(p);
    }

    // middle range around current
    for (let p = leftBoundary; p <= rightBoundary; p++) {
      pages.push(p);
    }

    // right-side gap
    if (rightBoundary < totalPages - 1) {
      pages.push(ELLIPSIS_TOKEN);
    } else {
      // include pages up to totalPages-1 when there is no right ellipsis
      for (let p = rightBoundary + 1; p < totalPages; p++) pages.push(p);
    }

    pages.push(totalPages); // last page
    return pages;
  };

  const compactPages = buildCompactPageList();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem
          onClick={() => {
            if (currentPage > 1) onPageChange(currentPage - 1);
          }}
          aria-disabled={currentPage <= 1}
        >
          <PaginationPrevious href="#" />
        </PaginationItem>

        {/* Dynamic page items */}
        {compactPages.map((token, idx) =>
          token === ELLIPSIS_TOKEN ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem
              key={`page-${token}`}
              onClick={() => {
                const pageNumber = token as number;
                if (pageNumber !== currentPage) onPageChange(pageNumber);
              }}
            >
              <PaginationLink href="#" isActive={token === currentPage}>
                {token}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem
          onClick={() => {
            if (currentPage < totalPages) onPageChange(currentPage + 1);
          }}
          aria-disabled={currentPage >= totalPages}
        >
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
