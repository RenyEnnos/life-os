import * as React from "react"

import { cn } from "@/shared/lib/cn"
import { Button } from "@/shared/ui/Button"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, className }, ref) => {
    const canGoPrevious = currentPage > 1
    const canGoNext = currentPage < totalPages

    const handlePrevious = () => {
      if (canGoPrevious) {
        onPageChange(currentPage - 1)
      }
    }

    const handleNext = () => {
      if (canGoNext) {
        onPageChange(currentPage + 1)
      }
    }

    if (totalPages <= 1) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          className
        )}
        role="navigation"
        aria-label="Pagination navigation"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          aria-label="Go to previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Previous
        </Button>

        <div
          className="text-sm font-medium text-zinc-300 tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          Page <span className="text-white">{currentPage}</span> of{" "}
          <span className="text-white">{totalPages}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Go to next page"
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </div>
    )
  },
)
Pagination.displayName = "Pagination"

export { Pagination }
