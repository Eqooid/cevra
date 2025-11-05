'use client';

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus, IconX, IconDotsVertical, IconTrash, IconFileDownload } from "@tabler/icons-react";
import { useState } from "react";
import useStorage from "@/hooks/use-storage";
import { Skeleton } from "../ui/skeleton";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "../ui/dropdown-menu";
import BulkDeleteDialog, { useBulkDeleteStorageDialogState } from "./bulk-delete-dialog";

/**
 * HeaderSection component renders the header section for the storage list,
 * including the title, description, and a dialog to add new storage.
 * @returns {JSX.Element} The HeaderSection component.
 * @author Cristono Wijaya
 */
export default function HeaderSection() { 
  const add = useStorage(state => state.add);
  const selectedStorage = useStorage(state => state.selectedStorage);
  const isLoading = useStorage(state => state.isLoading);

  const { isOpenBulkDelete, toggleModalBulkDelete } = useBulkDeleteStorageDialogState();

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    add(form.name, form.description);
  }

  return (
    <>
      <div className="flex flex-1 flex-col justify-center gap-1 px-7 pb-3 pt-3">
        <CardTitle>Storage List</CardTitle>
        <CardDescription>
          List of Vector Storage.
        </CardDescription>
      </div>
      <div className="pb-3 pt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-4" disabled={selectedStorage.length === 0}>
              <IconDotsVertical className="h-4 w-4"/>
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-30" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={toggleModalBulkDelete}>
                <IconTrash className="h-4 w-4 text-red-500 dark:text-red-400"/>
                Bulk Delete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconFileDownload className="h-4 w-4"/>
                Export Data
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="mr-4" disabled={isLoading}>
              <PlusIcon/>
              <span>Add New Storage</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Storage</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new storage.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Storage Name</Label>
                <Input id="name" name="name" onChange={handleChange} placeholder="Enter storage name"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" onChange={handleChange} placeholder="Enter storage description"/>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  <IconX className="h4 w-4"/>
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" onClick={handleSubmit}>
                  <IconPlus className="h-4 w-4"/>
                  Add Storage
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <BulkDeleteDialog isOpenBulkDelete={isOpenBulkDelete} toggleModalBulkDelete={toggleModalBulkDelete}/>
    </>
  );
}

/**
 * LoadingHeaderSection component renders a loading skeleton for the header section.
 * @returns {JSX.Element} The LoadingHeaderSection component.
 * @author Cristono Wijaya
 */
export function LoadingHeaderSection() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-1 px-7 pb-3 pt-3">
      <Skeleton className="h-6 w-full"/>
    </div>
  );
}