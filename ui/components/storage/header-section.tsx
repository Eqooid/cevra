'use client';

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
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

  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (name === 'name' && errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Storage name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Storage name must be at least 2 characters long';
    } else if (form.name.trim().length > 50) {
      newErrors.name = 'Storage name cannot exceed 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    await add(form.name.trim(), form.description.trim());
    
    setForm({ name: '', description: '' });
    setErrors({});
    setIsDialogOpen(false);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setForm({ name: '', description: '' });
      setErrors({});
    }
    setIsDialogOpen(open);
  };

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
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
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
                <Label htmlFor="name">
                  Storage Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={form.name}
                  onChange={handleChange} 
                  placeholder="Enter storage name"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <span className="text-sm text-destructive">{errors.name}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={form.description}
                  onChange={handleChange} 
                  placeholder="Enter storage description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleDialogClose(false)}>
                <IconX className="h-4 w-4"/>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleSubmit}
                disabled={!form.name.trim()}
              >
                <IconPlus className="h-4 w-4"/>
                Add Storage
              </Button>
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