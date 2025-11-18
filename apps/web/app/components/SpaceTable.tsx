"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import * as React from "react";

export type SpaceRow = {
  name: string;
  created: string;
  lastEdited: string;
  comments: string;
  author: string;
  members: string;
};

export const columns: ColumnDef<SpaceRow>[] = [
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => <div className="text-left">{row.getValue("name")}</div>,
    meta: { className: "text-left" },
  },
  {
    accessorKey: "location",
    header: "LOCATION",
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("location")}</div>
    ),
    meta: { className: "hidden md:table-cell text-left" },
  },
  {
    accessorKey: "created",
    header: "CREATED",
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("created")}</div>
    ),
    meta: { className: "hidden md:table-cell text-left" },
  },
  {
    accessorKey: "lastEdited",
    header: ({ column }) => (
      <div
        className="flex items-center gap-2 cursor-pointer justify-end md:justify-start text-right md:text-left"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Edited
        <ArrowUpDown className="size-4" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right md:text-left">
        {row.getValue("lastEdited")}
      </div>
    ),
    enableSorting: true,
    meta: { className: "text-right md:text-left" },
  },
  {
    accessorKey: "comments",
    header: "COMMENTS",
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("comments")}</div>
    ),
    meta: { className: "hidden md:table-cell text-left" },
  },
  {
    accessorKey: "author",
    header: "AUTHOR",
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("author")}</div>
    ),
    meta: { className: "hidden md:table-cell text-left" },
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <div className="flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-white/10 rounded-lg"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Add people</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { className: "w-4" },
  },
];

export function SpaceTable({ data }: { data: SpaceRow[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input placeholder="Filter emails..." className="max-w-sm" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden overflow-x-auto">
        <Table className="text-xs md:text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-white/5"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        ((
                          header.column.columnDef.meta as { className?: string }
                        )?.className ?? "") +
                        " text-xs md:text-sm text-white/50"
                      }
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-white/5 hover:bg-white/5 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        ((cell.column.columnDef.meta as { className?: string })
                          ?.className ?? "") +
                        " text-xs md:text-sm py-2 md:py-4"
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
