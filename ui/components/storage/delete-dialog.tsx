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
 * DialogState defines the structure of the state managed by the delete storage dialog.
 * It includes properties for the dialog's open state, a toggle function,
 * the data of the storage to be deleted, and a method to set this data.
 * @author Cristono Wijaya
 */
type DialogState = {
  isOpen: boolean;
  toggleModal: () => void
  data: {name:string, id:string} | null;
  setData: (object: {name:string, id:string}) => void
}

/**
 * useDeleteStorageDialogState is a Zustand store that manages the state for the delete storage dialog.
 * It provides default values and methods to toggle the dialog and set the storage data.
 * @return {DialogState} The state object containing dialog properties and methods.
 * @author Cristono Wijaya
 */
export const useDeleteStorageDialogState = create<DialogState>((set) => ({
  isOpen: false,
  toggleModal: () =>
    set((state: DialogState) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: {name:string, id:string}) => set(() => ({ data: data })),
}));

/**
 * DeleteDialog is a React component that renders a confirmation dialog for deleting a storage item.
 * It utilizes the useDeleteStorageDialogState for managing its open state and the data of the storage to be deleted.
 * @param {Pick<DialogState, "isOpen" | "data" | "toggleModal">} props - The properties for the dialog component.
 * @return {JSX.Element} The rendered DeleteDialog component.
 * @author Cristono Wijaya
 */
export default function DeleteDialog(props: Pick<DialogState, "isOpen" | "data" | "toggleModal">) {  
  const remove = useStorage(state => state.remove);

  const handleDelete = async () => {
    if (props.data) {
      await remove(props.data.id);
      props.toggleModal();
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.toggleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Storage &quot;{props.data?.name}&quot;</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this storage? This action cannot be undone.
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
  