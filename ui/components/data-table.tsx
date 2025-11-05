"use client"

import { useState } from "react";
import {
  ColumnDef, flexRender, 
  getCoreRowModel, useReactTable,
  getPaginationRowModel,
  SortingState, getSortedRowModel,
  ColumnFiltersState, getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

/**
 * DataTableProps defines the properties for the DataTable component.
 * It is a generic interface that takes two type parameters, TData and TValue.
 * - columns: An array of ColumnDef objects defining the structure of the table columns.
 * - data: An array of TData objects representing the rows of the table.
 * - isLoading: An optional boolean indicating whether the table is in a loading state.
 * @template TData - The type of the data objects in the table.
 * @template TValue - The type of the values in the table columns.
 * @author Cristono Wijaya
 */
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

/**
 * DataTable is a generic React component that renders a data table with sorting, filtering,
 * column visibility toggling, and pagination features.
 * It uses the @tanstack/react-table library for table management.
 * @param {DataTableProps<TData, TValue>} props - The properties for the DataTable component.
 * @return {JSX.Element} The rendered DataTable component.
 * @template TData - The type of the data objects in the table.
 * @template TValue - The type of the values in the table columns.
 * @author Cristono Wijaya
 */
export function DataTable<TData, TValue>({ columns, data, isLoading = false }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
  });

  const renderLoadingRows = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <TableRow key={`loading-${index}`}>
        {columns.map((_, cellIndex) => (
          <TableCell key={`loading-cell-${index}-${cellIndex}`}>
            <Skeleton className="h-7 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };
  
  return (
    <>
     <div className="flex items-center py-4">
        <Input
          placeholder="Filter all columns..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(event.target.value)
          }
          className="max-w-sm"
          disabled={isLoading}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto" disabled={isLoading}>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table> 
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
          <TableBody>
            {isLoading ? (
              renderLoadingRows()
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          Next
        </Button>
      </div>
    </>
  );
}