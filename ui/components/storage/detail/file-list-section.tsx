'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { 
  IconFile, IconDownload, IconTrash,
  IconUpload, IconDotsVertical, IconX,
  IconLoader, IconAlertTriangle,
  IconCircleCheckFilled
} from "@tabler/icons-react";
import useStorageFile, { FileItem, useFetchStorageFiles } from "@/hooks/use-storage-file";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteDialog from "./delete-dialog";
import { useDeleteStorageItemDialogState } from "./delete-dialog";

/**
 * Returns a Badge component based on the file status.
 * @param {string} status - The status of the file.
 * @returns {JSX.Element} A Badge component representing the file status.
 * @author Cristono Wijaya
 */
function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="secondary">
          <IconCircleCheckFilled className="w-3 h-3 mr-1 text-muted-foreground fill-green-500 dark:fill-green-400" />
          Completed
        </Badge>
      );
    case "in-progress":
      return (
        <Badge variant="secondary">
          <IconLoader className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="secondary">
          <IconAlertTriangle className="w-3 h-3 mr-1 stroke-red-500 dark:stroke-red-400"/>
          Failed
        </Badge>
      );
    case "canceled":
      return (
        <Badge variant="secondary">
          <IconX className="w-3 h-3 mr-1 stroke-red-500 dark:stroke-red-400" />
          Canceled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

/**
 * FileListSection component renders a section displaying a list of files and folders
 * within a specified storage. It includes functionalities for uploading files and
 * downloading all files, as well as a data table to display file details.
 * @param {Object} props - The properties for the FileListSection component.
 * @param {string} props.id - The ID of the storage whose files are to be displayed.
 * @returns {JSX.Element} The FileListSection component.
 * @author Cristono Wijaya
 */
export default function FileListSection({ id } : { id: string }) {
  
  const { data } = useFetchStorageFiles(id);
  const { 
    data:deleteData, 
    setData:setDeleteData,
    isOpen:deleteIsOpen,
    toggleModal:toggleDeleteModal 
  } = useDeleteStorageItemDialogState();
  const setIsUploadOpen = useStorageFile((state) => state.toggleModal);

  const filesColumns: ColumnDef<FileItem>[] = [
    {
      accessorKey: 'name',
      header: 'File Name',
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <IconFile className="w-4 h-4" />
            <span>{row.original.name}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => {
        return (<span>{row.original.size}</span>);
      }
    },
    {
      accessorKey: 'uploadedAt',
      header: 'Uploaded At',
      cell: ({ row }) => {
        return (<span>{row.original.lastModified}</span>);
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return getStatusBadge(row.original.status);
      }
    },
    {
      accessorKey: 'mimeType',
      header: 'Type',
      cell: ({ row }) => {
        return (<span>{row.original.mimeType || 'N/A'}</span>);
      }
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
           <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <IconDotsVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <IconDownload className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 dark:text-red-400"
              onClick={() => {
                setDeleteData({ 
                  name: row.original.name,
                  storageId: id,
                  itemId: row.original._id 
                });
                toggleDeleteModal();
              }}
            >
              <IconTrash className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
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
      <DeleteDialog isOpen={deleteIsOpen} 
        toggleModal={toggleDeleteModal}
        data={deleteData}/>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconFile className="w-5 h-5" />
              <span>Files & Folders</span>
              <Badge variant="secondary">{data.length} items</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" 
                onClick={() => setIsUploadOpen(true)}
              >
                <IconUpload className="w-4 h-4 mr-1" />
                Upload File
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={filesColumns} 
            data={data}
          />
        </CardContent>
      </Card>
    </>
  );
}

/**
 * FileListSectionSkeleton component renders a skeleton placeholder
 * for the FileListSection while data is being loaded.
 * @returns {JSX.Element} The FileListSectionSkeleton component.
 * @author Cristono Wijaya
 */
export function FileListSectionSkeleton() {
  return (
    <Skeleton className="h-64 w-full rounded-md"/>
  );
}