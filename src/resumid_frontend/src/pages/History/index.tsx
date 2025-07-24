import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Helmet } from "react-helmet";

// import hooks
import { toast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import useWindowSize from "@/hooks/useMediaQuery";

// import tables
import HistoryTable, { HistoryTableOptions } from "./HistoryTable";
import { columns } from "./columns";

// import types
import { History } from "../../../../declarations/resumid_backend/resumid_backend.did";
import { ColumnFiltersState, PaginationState, RowSelectionState, SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, ArrowDownUp, ArrowDownUpIcon, Filter, Grid2x2, PlusIcon, Search, SlidersHorizontal, SlidersHorizontalIcon, TableProperties, X } from "lucide-react";
import MemoizedInputField from "@/components/parts/MemoizedInputField";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import HistoryCards from "./HistoryCards";

type ColumnFilters = {
  id: string;
  value: string | number | boolean | null;
}

type ColumnSort = {
  id: string;
  desc: boolean;
}

type HistorySearchParams = {
  filter: ColumnFiltersState;
  sort: SortingState;
  page: number;
  size: number;
  search: string;
  view: "table" | "card";
}

interface HistoryResponse {
  message: string,
  data: History[],
  totalRowCount: number,
  currentPage: number,
  pageSize: number,
  totalPages: number,
}

const DEFAULT_ROW_OPTION: number[] = [10, 20, 30, 40, 50];

function decodeBase64(encodedString: string, returnVal: ColumnSort[] | ColumnFilters[] = []) {
  try {
    return JSON.parse(atob(encodedString));
  } catch (_) {
    return returnVal;
  }
}

function useExtractSearchParams(params: URLSearchParams): HistorySearchParams {
  const getParam = (key: string, defaultValue: any, transform: Function = (x: string) => x) => {
    const value = params.get(key);
    return value ? transform(value) : defaultValue;
  };

  const page = getParam("page", 1, (val: string) => Math.max(1, Number(val)));
  const size = getParam("size", 10, (val: string) =>
    DEFAULT_ROW_OPTION.includes(Number(val)) ? Number(val) : DEFAULT_ROW_OPTION[0]
  );
  const search = getParam("search", "", (val: string) =>
    decodeURIComponent(val)
      .trim()
      .replace(/[^\w\s@_-]/gi, "")
  );

  const filter = getParam("filter", [], (val: string) => decodeBase64(val));
  const sort = getParam("sort", [], (val: string) => decodeBase64(val));
  const view = getParam("view", "table", (val: string) => ["table", "card"].includes(val) ? val : "table")

  return { page, size, filter, sort, search, view };
}

export default function HistoryList() {
  const { isTablet, isMobile } = useWindowSize();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const { page, size, sort, filter, search, view: _view } = useExtractSearchParams(searchParams);


  // note: data table state
  const [view, setView] = useState<"table" | "card">(_view);
  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(filter);
  const [globalFilter, setGlobalFIlter] = useState<string>(search);
  const [sorting, setSorting] = useState<SortingState>(sort);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: size
  })

  const handleFilterChange = (columnId: string, value: string | number | boolean | null) => {
    setColumnFilters((prev) => {
      const newFilters = prev.filter((filter) => filter.id !== columnId);

      if (!value || value === "") {
        return newFilters;
      }

      return [...newFilters, { id: columnId, value }];
    });
  };

  const clearFilters = () => {
    setColumnFilters([]);
  };

  const handleSortChange = (columnId: string, direction: "ASC" | "DESC" | "NONE" | null) => {
    setSorting((prev) => {
      const newSorting = prev.filter((sort) => sort.id !== columnId);

      if (direction === "NONE" || direction === null) {
        return newSorting;
      }

      return [...newSorting, { id: columnId, desc: direction === "DESC" }];
    });
  };

  const getSortDirection = (sorting: { id: string; desc: boolean | null }[], columnId: string): "ASC" | "DESC" | "NONE" => {
    const sort = sorting.find((s) => s.id === columnId);
    if (!sort || sort.desc === null) return "NONE";
    return sort.desc ? "DESC" : "ASC";
  }

  const clearSorting = () => {
    setSorting([]);
  };

  const { resumidActor } = useAuth();

  async function handleGetHistories(): Promise<HistoryResponse> {
    try {
      const filterBys: [string, string][] = columnFilters.map((f) => [f.id, String(f.value)]);
      const sortBys: [string, boolean][] = sorting.map((s) => [s.id, s.desc]);

      const res = await resumidActor.getHistoriesPaginated(
        pagination.pageIndex,
        pagination.pageSize,
        [filterBys],
        [sortBys],
        globalFilter ?? ""
      );

      if ("ok" in res) {
        const response = res.ok;
        const { data, totalRowCount, totalPages, currentPage, pageSize } = response;

        const result = data.map((history: History) => {
          const { value: summary, score } = history.summary;

          const mappedResult = {
            id: history.historyId,
            fileName: history.fileName,
            jobTitle: history.jobTitle,
            score,
            date: new Date(history.createdAt).toISOString(),
            summary,
          };

          return mappedResult;
        })

        return {
          message: res?.message || "success",
          data: result,
          totalRowCount: Number(totalRowCount),
          totalPages: Number(totalPages),
          currentPage: Number(currentPage),
          pageSize: Number(pageSize),
        };
      } else {
        throw new Error(res.err ?? "Unknown error");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const { data: response = {} as HistoryResponse, isFetching, isLoading, isError, error } = useQuery({
    queryKey: ['histories', pagination.pageIndex, pagination.pageSize, globalFilter, columnFilters, sorting],
    queryFn: handleGetHistories,
    retry: 0,
    refetchOnWindowFocus: false
  })

  const { data = [], totalPages } = response;

  // note: table options
  const options: HistoryTableOptions<History> = {
    isLoading: isLoading,
    pageSizeOptions: DEFAULT_ROW_OPTION,
    pageCount: totalPages,
    tableBodyRowProps: ({ row }: { row: any }) => ({
      onClick: () => {
        navigate(`/history-detail/${row.original.id}`)
      },
      className: "text-paragraph cursor-pointer"
    }),

    state: {
      columnFilters,
      globalFilter,
      sorting,
      pagination,
      rowSelection: selectedRows
    },

    onRowSelectionChange: setSelectedRows,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFIlter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,

    enableColumnFilters: true,
    enableSorting: true,
    enableGlobalFilter: false,
    enableFilters: false,

    enableColumnPinning: false,
    enableHiding: false,

    enableMultiRowSelection: true,
    enableRowSelection: true,
  }

  // note: handle url updates
  const handleUpdateSearchParams = useCallback(
    (params: HistorySearchParams) => {
      const newParams = new URLSearchParams(location.search);

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            newParams.set(key, btoa(JSON.stringify(value)));
          } else {
            newParams.delete(key);
          }
        } else if (value !== undefined && value !== null && value !== "") {
          newParams.set(key, encodeURIComponent(String(value)));
        } else {
          newParams.delete(key);
        }
      });

      navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
    },
    [location.search, location.pathname]
  );

  useEffect(() => {
    console.log({ columnFilters, sorting, pagination, view });
    handleUpdateSearchParams({
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      filter: columnFilters,
      sort: sorting,
      search: globalFilter,
      view,
    });

  }, [columnFilters, sorting, pagination, view]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Analyze History - Resumid</title>
      </Helmet>

      <main className="min-h-screen responsive-container py-6 md:py-8 space-y-2">
        <section>
          <h2 className="text-balance font-outfit text-heading text-xl md:text-2xl font-semibold">
            Resume Analyze Result
          </h2>
          <p className="font-inter text-sm md:text-md text-paragraph mt-1 mb-4 md:mb-8">
            Easily browse and revisit the complete history of all resume’s you’ve analyzed
          </p>
        </section>
        <section className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 w-full">
            <MemoizedInputField
              id="history-search"
              startIcon={<Search size={16} />}
              fullWidth
              placeholder="Search resume filename, job title/role, score, etc"
              value={globalFilter}
              onChange={setGlobalFIlter}
            />
            <ToggleGroup type="single" value={view} onValueChange={(val: "table" | "card") => setView(val)} variant="outline" className="text-paragraph">
              <Tooltip>
                <TooltipTrigger>
                  <ToggleGroupItem value="table" aria-label="Toggle Table View" className="rounded-r-none border-r-0">
                    <TableProperties className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Table View</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <ToggleGroupItem value="card" aria-label="Toggle Card View" className="rounded-l-none">
                    <Grid2x2 className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Card View</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="grey-outline" size="icon" className="relative" >
                      {columnFilters.length > 0 && (
                        <Badge className="absolute -top-2 -right-1 h-5 min-w-5 bg-primary-500 rounded-full px-[5px] font-mono tabular-nums">{columnFilters.length}</Badge>
                      )}
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter Menu</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent className="text-paragraph">
                <DropdownMenuLabel>
                  <div className="flex justify-between items-center gap-2">
                    Filter Menu
                    {columnFilters.length > 0 && <span className="text-red-500 cursor-pointer" onClick={clearFilters}>Clear</span>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isLoading ? (
                  <>
                    <div className="p-2">
                      <Label htmlFor="filter-filename" className="space-y-1">
                        <p className="text-paragraph text-sm">Resume Name</p>
                        <MemoizedInputField
                          id="filter-filename"
                          className="font-normal"
                          type="text"
                          placeholder="Input resume name"
                          value={String(columnFilters.find((f) => f.id === "fileName")?.value ?? "")}
                          onChange={(value) => handleFilterChange("fileName", value)}
                        />
                      </Label>
                    </div>
                    <div className="p-2">
                      <Label htmlFor="filter-job-role" className="space-y-1">
                        <p className="text-paragraph text-sm">Job Title/Role</p>
                        <MemoizedInputField
                          id="filter-job-role"
                          className="font-normal"
                          type="text"
                          placeholder="Input job title/role"
                          value={String(columnFilters.find((f) => f.id === "jobTitle")?.value ?? "")}
                          onChange={(value) => handleFilterChange("jobTitle", value)}
                        />
                      </Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 space-y-2 min-w-[200px]">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="p-2 space-y-2 min-w-[200px]">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </>
                )}

              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="grey-outline" size="icon" className="relative" >
                      {sorting.length > 0 && (
                        <Badge className="absolute -top-2 -right-1 h-5 min-w-5 bg-primary-500 rounded-full px-[5px] font-mono tabular-nums">{sorting.length}</Badge>
                      )}
                      <ArrowDownUpIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sorting Menu</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent className="text-paragraph">
                <DropdownMenuLabel>
                  <div className="flex justify-between items-center gap-2">
                    Sorting Menu
                    {sorting.length > 0 && <span className="text-red-500 cursor-pointer" onClick={clearSorting}>Clear</span>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isLoading ? (
                  <>
                    <div className="p-2 min-w-[200px]">
                      <RadioGroup
                        defaultValue="NONE"
                        value={getSortDirection(sorting, "createdAt")}
                        onValueChange={(value) =>
                          handleSortChange("createdAt", value as "ASC" | "DESC" | "NONE")
                        }
                      >                        <p className="text-paragraph text-sm font-medium">Analyze Date</p>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="NONE" id="r0a" />
                          <Label className="font-normal" htmlFor="r0a">None</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="ASC" id="r1a" />
                          <Label className="font-normal" htmlFor="r1a">Ascending</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="DESC" id="r2a" />
                          <Label className="font-normal" htmlFor="r2a">Descending</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="p-2 min-w-[200px]">
                      <RadioGroup
                        defaultValue="NONE"
                        value={getSortDirection(sorting, "score")}
                        onValueChange={(value) =>
                          handleSortChange("score", value as "ASC" | "DESC" | "NONE")
                        }
                      >
                        <p className="text-paragraph text-sm font-medium">Score</p>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="NONE" id="r0b" />
                          <Label className="font-normal" htmlFor="r0b">None</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="ASC" id="r1b" />
                          <Label className="font-normal" htmlFor="r1b">Ascending</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="DESC" id="r2b" />
                          <Label className="font-normal" htmlFor="r2b">Descending</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 space-y-2 min-w-[200px]">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="p-2 space-y-2 min-w-[200px]">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </>
                )}

              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => navigate("/resume-analyzer")} size={isMobile ? "icon" : "default"} className="">
              {!isMobile ? " Analyze Resume" : <PlusIcon />}
            </Button>
          </div>
        </section>

        <div className="space-y-2">
          {isError && (
            <Alert variant="destructive" className="rounded-md">
              <AlertCircleIcon size={16} />
              <AlertTitle>Unable to load results</AlertTitle>
              <AlertDescription>
                {(error as Error)?.message ?? "An unknown error occurred"}
              </AlertDescription>
            </Alert>
          )}
          {view === "card" ? (
            <HistoryCards isLoading={isFetching || isLoading} data={data} pagination={pagination} setPagination={setPagination} pageCount={totalPages} rowSelection={selectedRows} onRowSelectionChange={setSelectedRows} pageSizeOptions={DEFAULT_ROW_OPTION} />
          ) : (
            <HistoryTable columns={[...columns, {
              header: 'Detail',
              cell: ({ row }: { row: any }) => (<Button variant="grey-outline" size="sm" onClick={() => navigate(`/history-detail/${row.original.id}`)}>View</Button>)
            }]} data={data} options={options} />
          )}
        </div>
      </main >
    </>
  )
}
