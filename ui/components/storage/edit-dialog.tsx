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
import { IconX, IconDeviceFloppy } from "@tabler/icons-react";
import { create } from "zustand";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

/**
 * DialogState defines the structure of the state managed by the edit storage dialog.
 * It includes properties for the dialog's open state, a toggle function,
 * the data of the storage to be edited, and a method to set this data.
 * @author Cristono Wijaya
 */
type DialogState = {
  isOpenEdit: boolean;
  toggleModalEdit: () => void
  dataEdit: {name:string, description:string, id:string};
  setDataEdit: (object: {name:string, description:string, id:string}) => void
}

/**
 * useEditStorageDialogState is a Zustand store that manages the state for the edit storage dialog.
 * @return {DialogState} The state object containing dialog properties and methods.
 * @author Cristono Wijaya
 */
export const useEditStorageDialogState = create<DialogState>((set) => ({
  isOpenEdit: false,
  toggleModalEdit: () =>
    set((state: DialogState) => ({ isOpenEdit: !state.isOpenEdit })),
  dataEdit: {name: "", description: "", id: ""},
  setDataEdit: (data: {name:string, description:string, id:string}) => set(() => ({ dataEdit: data }))
}));

/**
 * EditDialog is a React component that renders a dialog for editing storage details.
 * It utilizes the useEditStorageDialogState for managing its open state and the data of the storage to be edited.
 * @param {Pick<DialogState, "isOpenEdit" | "dataEdit" | "toggleModalEdit">} props - The properties for the dialog component.
 * @return {JSX.Element} The rendered EditDialog component.
 * @author Cristono Wijaya
 */
export default function EditDialog(props: Pick<DialogState, "isOpenEdit" | "dataEdit" | "toggleModalEdit">) {
  const update = useStorage(state => state.update);
  const [form, setForm] = useState({
    name: props.dataEdit?.name || "",
    description: props.dataEdit?.description || ""
  });

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = async () => {
    if (props.dataEdit && form.name.trim()) {
      await update(props.dataEdit.id, form.name.trim(), form.description.trim());
      props.toggleModalEdit();
    }
  };

  return (
    <Dialog open={props.isOpenEdit} onOpenChange={props.toggleModalEdit}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Storage &quot;{props.dataEdit?.name}&quot;</DialogTitle>
          <DialogDescription>
            Modify the details of this storage below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Storage Name
              <span className="text-destructive">*</span>
            </Label>
            <Input 
              value={form.name} 
              id="name" 
              name="name" 
              placeholder="Enter storage name"
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              value={form.description} 
              id="description" 
              name="description" 
              placeholder="Enter storage description"
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={props.toggleModalEdit}>
            <IconX className="h-4 w-4"/>
            Cancel
          </Button>
          <Button variant="default" onClick={handleEdit}>   
            <IconDeviceFloppy className="h-4 w-4"/>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
