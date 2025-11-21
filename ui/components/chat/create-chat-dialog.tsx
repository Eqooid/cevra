'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { IconChevronDown } from "@tabler/icons-react"
import { CheckIcon } from 'lucide-react';
import { Storage, useFetchStorage } from '@/hooks/use-storage';
import useChat from '@/hooks/use-chat';

/**
 * CreateChatDialog component that provides a modal for creating new chats.
 * Allows users to set chat name, description, and select storage.
 * @param {CreateChatDialogProps} props - The component props.
 * @return {JSX.Element} The rendered create chat dialog component.
 * @author Cristono Wijaya
 */
export function CreateChatDialog() {
  const open = useChat(state => state.isCreateDialogOpen);
  const toggleCreateDialog = useChat(state => state.toggleCreateDialog);
  const createChat = useChat(state => state.handleCreateChat);

  const [chatName, setChatName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStorage, setSelectedStorage] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    chatName?: string;
    storage?: string;
  }>({});

  const { data: storages, isLoading: loading } = useFetchStorage();

  const handleReset = () => {
    setChatName('');
    setDescription('');
    setSelectedStorage(null);
    setErrors({});
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      handleReset();
    }
    toggleCreateDialog(open);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!chatName.trim()) {
      newErrors.chatName = 'Chat name is required';
    }

    if (!selectedStorage) {
      newErrors.storage = 'Please select a storage';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createChat({
      name: chatName.trim(),
      description: description.trim(),
      storageId: selectedStorage!.id,
      storageName: selectedStorage!.name,
    })

    handleReset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Set up a new chat session with a name, description, and storage selection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chat Name */}
          <div className="grid gap-2">
            <Label htmlFor="chatName">
              Chat Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="chatName"
              value={chatName}
              onChange={(e) => {
                setChatName(e.target.value);
                if (errors.chatName) {
                  setErrors(prev => ({ ...prev, chatName: undefined }));
                }
              }}
              placeholder="Enter chat name..."
              className={errors.chatName ? 'border-destructive' : ''}
            />
            {errors.chatName && (
              <span className="text-sm text-destructive">{errors.chatName}</span>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter chat description (optional)..."
            />
          </div>

          {/* Storage Selection */}
          <div className="grid gap-2">
            <Label>
              Storage <span className="text-destructive">*</span>
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={`justify-between ${errors.storage ? 'border-destructive' : ''}`}
                  disabled={loading}
                >
                  {selectedStorage ? (
                    <div className="flex items-center gap-2">
                      <span>{selectedStorage.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {selectedStorage.id}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      {loading ? 'Loading storages...' : 'Select storage...'}
                    </span>
                  )}
                  <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[350px]">
                {storages.map((storage: Storage) => (
                  <DropdownMenuItem
                    key={storage._id}
                    onClick={() => {
                      setSelectedStorage({
                        id: storage._id,
                        name: storage.name
                      });
                      if (errors.storage) {
                        setErrors(prev => ({ ...prev, storage: undefined }));
                      }
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span className="font-medium">{storage.name}</span>
                        {storage.description && (
                          <span className="text-sm text-muted-foreground">
                            {storage.description}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        
                        {selectedStorage?.id === storage._id && (
                          <CheckIcon className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                {storages.length === 0 && !loading && (
                  <DropdownMenuItem disabled>
                    No storages available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.storage && (
              <span className="text-sm text-destructive">{errors.storage}</span>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Create Chat
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}