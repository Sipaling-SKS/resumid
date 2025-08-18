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
      const cvContent = "Tiara Puspita puspitatiara14@gmail.com Gunung Putri, Bogor, 16962. https://github.com/tiarapus/ 085959148809 (WhatsApp) https://www.linkedin.com/in/tiarapu spita-/ https://tiara-personalsite.web.app/ Summary A highly motivated Informatics fresh graduate from Gunadarma University (GPA 3.86) with hands-on experience in software development, data analytics, and machine learning through academic projects and coding competitions. Equipped with strong analytical and problem-solving skills, and a keen interest in business strategy, and data-driven decision-making. Passionate about continous learning, eager to develop new skills, and contribute to impactful projects to drive business growth. Professional Experience 2025/04 – present Jakarta, Indonesia Software Engineer Mitramas Infosys Global (KB Bank) Placement @ KB Bukopin Bank •Monitor and track defects to ensure timely identification, escalation, and resolution •Develop and implement effective solutions for identified issues, including conducting internal testing •Collaborate with QA teams to support and facilitate System Integration Testing (SIT) 2023/05 – 2023/06 Remote Company-Based Capstone Team Bangkit Academy 2023 •Design and develop a marketplace platform for ecotourism that incorporates geo-tagging and carbon footprint, addressing the problem statement presented by AMATI Indonesia. •Develop recommendation systems by constructing a data analysis and machine learning model that leverages both content-based and collaborative filtering techniques. •Create a machine learning API using Python Flask. •Create mockup design for multiple app pages using Figma. •App Testing and Debugging. 2022/09 – 2023/09 Depok, Indonesia Course Assistant & Instructor Lembaga Pengembangan Komputerisasi Universitas Gunadarma •Review and evaluate practitioners' activity reports. •Collaborate with course tutor and supervisor to assist in co-facilitating beginner courses for approximately 30 practitioners that focus on the Fundamental of DBMS, Web Programming, Fundamental Network, and Fundamental Server OS. •To guide 25 practitioners in completing course activities and delivering beginner-level DBMS materials using SQL Server Management Studio. mailto:puspitatiara14@gmail.com tel:085959148809 (WhatsApp) Skills Programming Languages Python, PHP, Javascript Project Management Problem Solving Deep Learning Basic Linux Bash Scripting Website Development Laravel, ReactJS, NodeJS Version Control Git DBMS Oracle DB, MSSQL Google Cloud Platform BigQuery, VertexAI Basic Cybersecurity Education 2020 – 2024 Depok, Indonesia Informatics Universitas Gunadarma GPA: 3.86 out of 4.00 2023/02 – 2023/07 Remote Machine Learning Cohort Bangkit Academy 2023 •Active team members of the Best team for company’s projects. •Best Capstone Presenters - Company capstone. Final Score: 91/100 2025/01 – 2025/02 Remote Google #JuaraGCP11 Google Cloud Skills Boost Key skills learning: AI and ML with Vertex AI & Gemini, Virtual Machines, BigQuery, IAM, Cloud Compute, Cloud Data Security, etc. Projects 2024/12 – 2024/12 Resumid ICP Hub Indonesia Hachkathon project Resumid is a decentralized Web-based application designed to help users analyze resumes in depth by leveraging AI technology. This platform provides a match score between the resume and the job position applied for, while providing a comprehensive summary of the quality of the user's resume 2023/09 – 2024/01 Juice Friend Campus Final Team Project As the project manager overseeing the development of a web-based e-commerce platform for Juice Friend, a micro, small, and medium-sized enterprise (UMKM) in the juice industry, my responsibilities include efficiently managing the team, coordinating tasks, and maintaining communication channels to ensure the project progresses smoothly through the Agile Software Development Life Cycle (SDLC), from planning, requirement analysis to testing and deployment. 2023/07 – 2023/08 Batique VCP Competition UPNVY As the project manager leading the team in the Agile software development life cycle (SDLC) for the creation of a web-based social media platform that supports local artists who are passionate about batik. This platform will utilize machine learning, specifically image classification content filtering, to enhance user experience by effectively filtering out spam content. My responsibilities include developing the article page, ensuring effective communication within the team, and preparing technical documentation. Awards 2024/12 1st Winner ICP Hub Hackathon 9.0 ICP Hub Indonesia 2023/07 Top 9 Best Company Capstone Project Team Bangkit Academy 2023 Batch 1 2023/07 Best Presenter in Company Capstone Team Bangkit Academy 2023 Certificates Tensorflow Developer Certificate Google Data Analitycs Scholarship Toefl ITP Prediction Test Brighten English Pare Score : 620 Oracle Training - Intermediate Level Data Analytics Mini Course RevoU Best Capstone Project Bangkit Academy Pelatihan SQL Server - Intermediate Level Junior Website Developer (BNSP) https://www.credential.net/21277ae8-1112-4e7f-a977-42d4f6081e40 https://startupcampus.id/certificate/GCC-DA6FBC https://drive.google.com/file/d/19qJCIy36fyWb9kmYXM8ji3X2S5q2MjCX/view?usp=drive_link https://drive.google.com/file/d/1YYqpy7eeafOH9fFERd2cYs-d44KoK-Gw/view https://drive.google.com/file/d/1_YRWmxbxor33cvYuOeFq6x7Zg9rwefdn/view"

      try {
        const ex = await resumidActor.extractResumeToDraft(cvContent);
        console.log("extract", ex);
      } catch (error) {
        console.error(error);
        throw error;
      }
      try {
        const draftId = "draftId1"; // Replace with actual draft ID
        const draft = await resumidActor.GetDraftByUserId();
        const profile = await resumidActor.saveDraftToProfile(draftId)
        const profileMap = await resumidActor.getProfileByUserId();

        // console.log("ressponse del:", del);
        console.log("Draft:", draft);
        console.log("saveToProfile:", profile);
        console.log("profileMap:", profileMap);
      } catch (err) {
        console.error("Error:", err);
      }

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
            score: isNaN(Number(score)) ? 0 : Number(score),
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
