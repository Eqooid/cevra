'use client';

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { Checkbox } from "../ui/checkbox";
import { 
  IconDatabase, IconLoader, IconDisc, IconCircleCheckFilled, IconAlertTriangle, 
  IconX, IconDotsVertical, IconTrash, IconPencil, IconInfoCircle 
} from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import useStorage, { Storage, useFetchStorage } from "@/hooks/use-storage";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import DeleteDialog, { useDeleteStorageDialogState } from "./delete-dialog";
import EditDialog, { useEditStorageDialogState } from "./edit-dialog";
import Link from "next/link";

/**
 * TableSection component renders a data table displaying storage information.
 * It includes functionalities for editing and deleting storage entries via dialogs.
 * @returns {JSX.Element} The TableSection component.
 * @author Cristono Wijaya
 */
export default function TableSection() {
  const { data, isLoading } = useFetchStorage();
  const selectedStorage = useStorage(state => state.selectedStorage);
  const setSelectedStorage = useStorage(state => state.setSelectedStorage);

  const { isOpen, toggleModal, data: deleteData, setData } = useDeleteStorageDialogState();
  const { isOpenEdit, toggleModalEdit, dataEdit, setDataEdit } = useEditStorageDialogState();

  const storageColumns: ColumnDef<Storage>[] = [
    {
      id: "select",
      header: ({ table }) => {
        return (
          <Checkbox 
            checked={(table.getIsAllPageRowsSelected() && selectedStorage.length > 0) || 
              (selectedStorage.length > 0 && "indeterminate")}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              if (value) {
                const allPageIds = table.getRowModel().rows.map(row => row.original._id);
                setSelectedStorage(allPageIds);
              } else {
                setSelectedStorage([]);
              }
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox 
          checked={row.getIsSelected() && selectedStorage.indexOf(row.original._id) != -1}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            const currentSelected = selectedStorage;
            const rowId = row.original._id;
            if (value) {
              if (!currentSelected.includes(rowId)) {
                setSelectedStorage([...currentSelected, rowId]);
              }
            } else {
              setSelectedStorage(currentSelected.filter(id => id !== rowId));
            }
          }}
          aria-label="Select row"
        />
      )
    },
    {
      accessorKey: "name",
      header: "Storage Name",
      cell: ({ row }) => {
        return (
          <div>
            <IconDatabase className="inline mr-2 mb-1 h-4 w-4 text-muted-foreground"/>
            {row.getValue("name")}
          </div>
        );
      }
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "inProgress",
      header: "In Progress",
      cell: ({ row }) => {
        return (
          <div>
            <Badge variant="secondary">
              <IconLoader className="inline h-4 w-4 text-muted-foreground"/>
              {row.getValue("inProgress")} 
            </Badge>
          </div>
        );
      }
    },
    {
      accessorKey: "completed",
      header: "Completed",
      cell: ({ row }) => {
        return (
          <div>
            <Badge variant="secondary">
              <IconCircleCheckFilled className="inline h-4 w-4 text-muted-foreground fill-green-500 dark:fill-green-400"/>
              {row.getValue("completed")} 
            </Badge>
          </div>
        );
      }
    },
    {
      accessorKey: "failed",
      header: "Failed",
      cell: ({ row }) => {
        return (
          <div>
            <Badge variant="secondary">
              <IconAlertTriangle className="inline h-4 w-4 text-muted-foreground stroke-red-500 dark:stroke-red-400"/>
              {row.getValue("failed")} 
            </Badge>
          </div>
        );
      }

    },
    {
      accessorKey: "cancelled",
      header: "Cancelled",
      cell: ({ row }) => {
        return (
          <div>
            <Badge variant="secondary">
              <IconX className="inline h-4 w-4 text-muted-foreground stroke-red-500 dark:stroke-red-400"/>
              {row.getValue("cancelled")} 
            </Badge>
          </div>
        );
      }
    },
    {
      accessorKey: "total",
      header: "Total",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => {
                setDataEdit({ name: row.original.name, description: row.original.description, id: row.original._id });
                toggleModalEdit();
              }}>
                <IconPencil className="inline h-4 w-4 text-muted-foreground"/>
                Edit
              </DropdownMenuItem>
               <Link href={`/storage/${row.original._id}`} className="w-full">
              <DropdownMenuItem>
               
                <IconInfoCircle className="inline h-4 w-4 text-muted-foreground"/>
                Detail
                
              </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              {}
              <DropdownMenuItem variant="destructive" onClick={() => {
                setData({ name: row.original.name, id: row.original._id });
                toggleModal();
              }}> 
                <IconTrash className="inline h-4 w-4 text-muted-foreground"/>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <>
      <EditDialog 
        key={dataEdit.id} 
        isOpenEdit={isOpenEdit} 
        toggleModalEdit={toggleModalEdit} 
        dataEdit={dataEdit}
      />
      <DeleteDialog isOpen={isOpen} toggleModal={toggleModal} data={deleteData}/>
      <DataTable columns={storageColumns} data={data} isLoading={isLoading} />
    </>
  );
}

/**
 * LoadingTableSection component renders a loading skeleton for the table section.
 * @returns {JSX.Element} The LoadingTableSection component.
 * @author Cristono Wijaya
 */
export function LoadingTableSection() {
  return (
    <div className="flex justify-center items-center h-32">
      <Skeleton className="h-8 w-full" />
    </div>
  );
}