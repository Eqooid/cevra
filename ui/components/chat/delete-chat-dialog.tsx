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
import useChat from "@/hooks/use-chat";
import { IconTrash, IconX } from "@tabler/icons-react";
import { create } from "zustand";

/**
 * DialogState defines the structure of the state managed by the delete chat dialog.
 * It includes properties for the dialog's open state, a toggle function,
 * the data of the chat to be deleted, and a method to set this data.
 * @author Cristono Wijaya
 */
type DialogState = {
  isOpen: boolean;
  toggleModal: () => void
  data: {name: string, id: string} | null;
  setData: (object: {name: string, id: string}) => void
}

/**
 * useDeleteChatDialogState is a Zustand store that manages the state for the delete chat dialog.
 * It provides default values and methods to toggle the dialog and set the chat data.
 * @return {DialogState} The state object containing dialog properties and methods.
 * @author Cristono Wijaya
 */
export const useDeleteChatDialogState = create<DialogState>((set) => ({
  isOpen: false,
  toggleModal: () =>
    set((state: DialogState) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: {name: string, id: string}) => set(() => ({ data: data })),
}));

/**
 * DeleteChatDialog is a React component that renders a confirmation dialog for deleting a chat item.
 * It utilizes the useDeleteChatDialogState for managing its open state and the data of the chat to be deleted.
 * @param {Pick<DialogState, "isOpen" | "data" | "toggleModal">} props - The properties for the dialog component.
 * @return {JSX.Element} The rendered DeleteChatDialog component.
 * @author Cristono Wijaya
 */
export default function DeleteChatDialog(props: Pick<DialogState, "isOpen" | "data" | "toggleModal">) {  
  const handleDeleteChat = useChat(state => state.handleDeleteChat);

  const handleDelete = async () => {
    if (props.data) {
      await handleDeleteChat(props.data.id);
      props.toggleModal();
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.toggleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Chat &quot;{props.data?.name}&quot;</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this chat? This action cannot be undone and all messages will be permanently lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={props.toggleModal}>
            <IconX className="h-4 w-4 mr-2"/>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <IconTrash className="h-4 w-4 mr-2"/>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}