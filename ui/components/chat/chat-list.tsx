'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import useChat, { Chat } from '@/hooks/use-chat';
import { Skeleton } from '../ui/skeleton';
import React from 'react';
import EditChatDialog, { useEditChatDialogState } from './edit-chat-dialog';
import DeleteChatDialog, { useDeleteChatDialogState } from './delete-chat-dialog';


/**
 * ChatList component that displays a list of chats with create new chat functionality.
 * @param {ChatListProps} props - The component props.
 * @return {JSX.Element} The rendered chat list component.
 * @author Cristono Wijaya
 */
export function ChatList() {
  const toggleCreateDialog = useChat(state => state.toggleCreateDialog);
  const setSelectedChatById = useChat(state => state.setSelectedChatById);
  const selectedChatIdState = useChat(state => state.selectedChat?.id || null); 
  const isStreaming = useChat(state => state.isStreaming);
  const data = useChat(state => state.chats);
  
  // Edit dialog state
  const isOpenEdit = useEditChatDialogState(state => state.isOpenEdit);
  const toggleModalEdit = useEditChatDialogState(state => state.toggleModalEdit);
  const dataEdit = useEditChatDialogState(state => state.dataEdit);
  const setDataEdit = useEditChatDialogState(state => state.setDataEdit);
  
  // Delete dialog state
  const isOpenDelete = useDeleteChatDialogState(state => state.isOpen);
  const toggleModalDelete = useDeleteChatDialogState(state => state.toggleModal);
  const dataDelete = useDeleteChatDialogState(state => state.data);
  const setDataDelete = useDeleteChatDialogState(state => state.setData);

  const handleEditClick = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setDataEdit({ name: chat.name, description: chat.description, id: chat.id });
    toggleModalEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setDataDelete({ name: chat.name, id: chat.id });
    toggleModalDelete();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Badge variant="secondary" className="text-xs">
            {data.length}
          </Badge>
        </div>
        <Button 
          onClick={() => { toggleCreateDialog(true);}}
          className="w-full"
          size="sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-muted-foreground mb-2">No chats yet</div>
            <div className="text-sm text-muted-foreground">
              Create your first chat to get started
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((chat) => (
              <Card
                key={chat.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                  selectedChatIdState === chat.id
                    ? 'bg-accent border-primary'
                    : 'bg-background hover:bg-accent'
                }`}
                onClick={() => { 
                  if (isStreaming) return;
                  setSelectedChatById(chat.id)
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm line-clamp-1 flex-1">
                      {chat.name}
                    </h3>
                    <div className="flex items-center gap-2 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-accent"
                        onClick={(e) => handleEditClick(e, chat)}
                      >
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => handleDeleteClick(e, chat)}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {chat.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {chat.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {chat.storageName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {chat.countMessages} messages
                    </span>
                  </div>
                  
                  {chat.countMessages > 0 && (
                    <>
                      <Separator />
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {chat.lastMessage?.role === 'user' ? 'You: ' : 'AI: '}
                        {chat.lastMessage?.content}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Dialogs */}
      <EditChatDialog 
        isOpenEdit={isOpenEdit}
        dataEdit={dataEdit}
        toggleModalEdit={toggleModalEdit}
      />
      <DeleteChatDialog 
        isOpen={isOpenDelete}
        data={dataDelete}
        toggleModal={toggleModalDelete}
      />
    </div>
  );
}

/**
 * ChatListSkeleton component that displays a skeleton loader for the chat list.
 * @return {JSX.Element} The rendered chat list skeleton component.
 * @author Cristono Wijaya
 */
export function ChatListSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-10" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
      {/* Chat List Skeleton */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="p-3">  
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 