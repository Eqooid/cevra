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
import useStorageFile from "@/hooks/use-storage-file";
import { IconTrash, IconX } from "@tabler/icons-react";
import { create } from "zustand";

/**
 * Type definition for the delete dialog state.
 * @typedef {Object} DialogState
 * @property {boolean} isOpen - Indicates if the dialog is open.
 * @property {function} toggleModal - Function to toggle the dialog open/close state.
 * @property {{name:string, storageId:string, itemId:string} | null} data - Data of the item to be deleted.
 * @property {function} setData - Function to set the data of the item to be deleted.
 * @author Cristono Wijaya
 */
type DialogState = {
  isOpen: boolean;
  toggleModal: () => void
  data: {name:string, storageId:string, itemId:string} | null;
  setData: (object: {name:string, storageId:string, itemId:string}) => void
}

/**
 * Zustand store for managing the delete dialog state.
 * @constant {import('zustand').UseStore<DialogState>}
 * @author Cristono Wijaya
 */
export const useDeleteStorageItemDialogState = create<DialogState>((set) => ({
  isOpen: false,
  toggleModal: () =>
    set((state: DialogState) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: {name:string, storageId:string, itemId:string}) => set(() => ({ data: data })),
}));

/**
 * DeleteDialog component renders a confirmation dialog for deleting a storage file.
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates if the dialog is open.
 * @param {function} props.toggleModal - Function to toggle the dialog open/close state.
 * @param {{name:string, storageId:string, itemId:string} | null} props.data - Data of the item to be deleted.
 * @returns {JSX.Element} The DeleteDialog component.
 * @author Cristono Wijaya
 */
export default function DeleteDialog(props: Pick<DialogState, "isOpen" | "data" | "toggleModal">) {  
  const remove = useStorageFile(state => state.removeFile);
  
  const handleDelete = async () => {
    if (props.data) {
      await remove(props.data.itemId, props.data.storageId);
      props.toggleModal();
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.toggleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete File &quot;{props.data?.name}&quot;</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this file? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={props.toggleModal}>
            <IconX className="h-4 w-4"/>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <IconTrash className="h-4 w-4"/>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}