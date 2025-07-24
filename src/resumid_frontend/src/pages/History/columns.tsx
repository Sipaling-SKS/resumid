import { History } from "../../../../declarations/resumid_backend/resumid_backend.did";

import { ColumnDef } from "@tanstack/react-table";
import { cn, formatISOToDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase } from "lucide-react";

export const columns: ColumnDef<History>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }

        className={cn(
          "scale-75 translate-y-[1px]",
          "data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
        )}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fileName",
    header: "Resume Name",
    cell: ({ cell }) => cell.getValue() || "-"
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title / Role",
    cell: ({ row }) => (
      <div className="w-fit inline-flex items-center gap-2 border border-accent-500 py-2 px-3 rounded-lg text-[#333] font-medium font-inter text-sm bg-accent-950 mt-1">
        <Briefcase className="w-3 h-3 text-purple-600" />
        <span className="font-inter text-xs font-medium text-purple-700">
          {row.original.jobTitle}
        </span>
      </div>
    )
  },
  {
    accessorKey: "score",
    header: "Overall Score",
    cell: ({ cell }) => {
      const value: number = cell.getValue<any>();
      return !isNaN(value) ? (
        <p className="text-primary-500 font-medium">{`${value}/100`}</p>
      ) : (
        <p className="text-red-600 font-medium">{"N/A"}</p>
      )
    }
  },
  {
    accessorKey: "date",
    header: "Analyze Date",
    cell: ({ cell }) => {
      const value: string = cell.getValue<any>();
      return formatISOToDate(value);
    }
  }
]
