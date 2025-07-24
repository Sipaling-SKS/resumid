import { History } from "../../../../declarations/resumid_backend/resumid_backend.did";

import { ColumnDef } from "@tanstack/react-table";
import { formatISOToDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<History>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
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
    cell: ({ cell }) => cell.getValue() || "-"
  },
  {
    accessorKey: "score",
    header: "Overall Score",
    cell: ({ cell }) => {
      const value: number = cell.getValue<any>();
      return !isNaN(value) ? `${value}/100` : "N/A"
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
