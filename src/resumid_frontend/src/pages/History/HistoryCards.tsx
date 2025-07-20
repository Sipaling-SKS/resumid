import { Button } from "@/components/ui/button"
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SkeletonHistoryThumbnail from "@/components/parts/SkeletonHistoryThumbnail"
import HistoryThumbnail from "@/components/parts/HistoryThumbnail"
import { useNavigate } from "react-router"
import { History } from "../../../../declarations/resumid_backend/resumid_backend.did"

interface HistoryCardsProps {
  data: any[],
  isLoading?: boolean,
  rowSelection: Record<string, boolean>
  onRowSelectionChange: (rowSelection: Record<string, boolean>) => void
  pagination: {
    pageIndex: number
    pageSize: number
  }
  pageCount: number
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void
  pageSizeOptions?: number[]
}

const DEFAULT_ROW_OPTION: number[] = [10, 20, 30, 40, 50]

export default function HistoryCards({
  data,
  isLoading,
  rowSelection,
  onRowSelectionChange,
  pagination,
  setPagination,
  pageCount,
  pageSizeOptions = DEFAULT_ROW_OPTION
}: HistoryCardsProps) {
  const toggleRow = (id: string) => {
    onRowSelectionChange({
      ...rowSelection,
      [id]: !rowSelection[id]
    })
  }

  const { pageIndex, pageSize } = pagination

  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1

  const setPageIndex = (index: number) => {
    setPagination({ pageIndex: index, pageSize })
  }

  const setPageSize = (size: number) => {
    setPagination({ pageIndex: 0, pageSize: size })
  }

  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonHistoryThumbnail key={idx} />
          ))
        ) : data.length ? (
          data.map((item: any) => (
            <HistoryThumbnail
              key={item.id}
              data={item}
              onSelect={(id) => navigate(`/history/${id}`)}
            />
          ))
        ) : (
          <div className="col-span-full h-24 flex items-center justify-center">
            <p className="text-center text-placeholder">
              No results
            </p>
          </div>
        )}
      </div>


      {/* Pagination Section */}
      <div className="flex justify-end items-center space-x-6 lg:space-x-8 px-4 py-3 border-t-[1px]">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-paragraph">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm text-paragraph">
          Page {pageIndex + 1} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => setPageIndex(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
