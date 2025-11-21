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
import { IconX, IconDeviceFloppy } from "@tabler/icons-react";
import { create } from "zustand";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

/**
 * DialogState defines the structure of the state managed by the edit chat dialog.
 * It includes properties for the dialog's open state, a toggle function,
 * the data of the chat to be edited, and a method to set this data.
 * @author Cristono Wijaya
 */
type DialogState = {
  isOpenEdit: boolean;
  toggleModalEdit: () => void
  dataEdit: {name: string, description: string, id: string};
  setDataEdit: (object: {name: string, description: string, id: string}) => void
}

/**
 * useEditChatDialogState is a Zustand store that manages the state for the edit chat dialog.
 * @return {DialogState} The state object containing dialog properties and methods.
 * @author Cristono Wijaya
 */
export const useEditChatDialogState = create<DialogState>((set) => ({
  isOpenEdit: false,
  toggleModalEdit: () =>
    set((state: DialogState) => ({ isOpenEdit: !state.isOpenEdit })),
  dataEdit: {name: "", description: "", id: ""},
  setDataEdit: (data: {name: string, description: string, id: string}) => set(() => ({ dataEdit: data }))
}));

/**
 * EditChatDialog is a React component that renders a dialog for editing chat details.
 * It utilizes the useEditChatDialogState for managing its open state and the data of the chat to be edited.
 * @param {Pick<DialogState, "isOpenEdit" | "dataEdit" | "toggleModalEdit">} props - The properties for the dialog component.
 * @return {JSX.Element} The rendered EditChatDialog component.
 * @author Cristono Wijaya
 */
export default function EditChatDialog(props: Pick<DialogState, "isOpenEdit" | "dataEdit" | "toggleModalEdit">) {  
  const handleEditChat = useChat(state => state.handleEditChat);
  
  // Use the current dataEdit values directly as default
  const [name, setName] = useState(props.dataEdit.name || "");
  const [description, setDescription] = useState(props.dataEdit.description || "");

  const handleEdit = async () => {
    if (props.dataEdit.id && name.trim()) {
      await handleEditChat(props.dataEdit.id, {
        name: name.trim(),
        description: description.trim()
      });
      props.toggleModalEdit();
    }
  };

  // Update values when dataEdit changes (when different chat is selected for editing)
  const currentChatId = props.dataEdit.id;
  const [lastChatId, setLastChatId] = useState(currentChatId);
  
  if (currentChatId !== lastChatId) {
    setName(props.dataEdit.name || "");
    setDescription(props.dataEdit.description || "");
    setLastChatId(currentChatId);
  }

  return (
    <Dialog open={props.isOpenEdit} onOpenChange={props.toggleModalEdit}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Chat</DialogTitle>
          <DialogDescription>
            Make changes to your chat name and description here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Enter chat name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter chat description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={props.toggleModalEdit}>
            <IconX className="h-4 w-4 mr-2"/>
            Cancel
          </Button>
          <Button onClick={handleEdit} disabled={!name.trim()}>
            <IconDeviceFloppy className="h-4 w-4 mr-2"/>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}