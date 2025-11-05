'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useStorage from "@/hooks/use-storage";
import { IconTrash, IconX } from "@tabler/icons-react";
import { create } from "zustand";

/**
 * Dialog state for bulk delete storage dialog.
 * Includes properties for open state and a toggle function.
 * @author Cristono Wijaya
 */
type DialogState = {
  isOpenBulkDelete: boolean;
  toggleModalBulkDelete: () => void
}

/**
 * useBulkDeleteStorageDialogState is a Zustand store that manages the state for the bulk delete storage dialog.
 * It provides default values and a method to toggle the dialog.
 * @return {DialogState} The state object containing dialog properties and methods.
 * @author Cristono Wijaya
 */
export const useBulkDeleteStorageDialogState = create<DialogState>((set) => ({
  isOpenBulkDelete: false,
  toggleModalBulkDelete: () =>
    set((state: DialogState) => ({ isOpenBulkDelete: !state.isOpenBulkDelete }))
}));

/**
 * BulkDeleteDialog is a React component that renders a confirmation dialog for bulk deleting storage items.
 * It utilizes the useBulkDeleteStorageDialogState for managing its open state.
 * @param {Pick<DialogState, "isOpenBulkDelete" | "toggleModalBulkDelete">} props - The properties for the dialog component.
 * @return {JSX.Element} The rendered BulkDeleteDialog component.
 * @author Cristono Wijaya
 */
export default function BulkDeleteDialog(props: Pick<DialogState, "isOpenBulkDelete" | "toggleModalBulkDelete">) {  
  const bulkRemove = useStorage(state => state.bulkRemove);

  const handleBulkDelete = async () => {
    await bulkRemove();
    props.toggleModalBulkDelete();
  };

  return (
    <Dialog open={props.isOpenBulkDelete} onOpenChange={props.toggleModalBulkDelete}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete the selected storage?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={props.toggleModalBulkDelete}>
            <IconX className="h-4 w-4"/>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleBulkDelete}>
            <IconTrash className="h-4 w-4"/>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
  