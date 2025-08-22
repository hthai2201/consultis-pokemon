"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaginationWithParamsProps {
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
}

export default function PaginationWithParams({
  currentPage,
  totalCount,
  itemsPerPage,
}: PaginationWithParamsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Mobile-first layout */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalCount} Pokemon
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevious}
          variant="outline"
          className="w-full sm:w-auto"
        >
          ← Previous
        </Button>

        <Badge
          variant="secondary"
          className="px-4 py-2 min-w-[120px] text-center"
        >
          Page {currentPage} of {totalPages}
        </Badge>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Next →
        </Button>
      </div>

      {/* Quick page jumper for larger screens */}
      {totalPages > 1 && (
        <div className="hidden sm:flex items-center justify-center gap-1">
          {/* Show first page */}
          {currentPage > 3 && (
            <>
              <Button
                onClick={() => handlePageChange(1)}
                variant="ghost"
                size="sm"
              >
                1
              </Button>
              {currentPage > 4 && (
                <span className="text-muted-foreground">...</span>
              )}
            </>
          )}

          {/* Show surrounding pages */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, currentPage - 2) + i;
            if (pageNum > totalPages) return null;

            return (
              <Button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                variant={pageNum === currentPage ? "default" : "ghost"}
                size="sm"
              >
                {pageNum}
              </Button>
            );
          })}

          {/* Show last page */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="text-muted-foreground">...</span>
              )}
              <Button
                onClick={() => handlePageChange(totalPages)}
                variant="ghost"
                size="sm"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
