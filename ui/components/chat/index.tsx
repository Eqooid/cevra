'use client';

import { useEffect } from 'react';
import { ChatList, ChatListSkeleton } from './chat-list';
import { ChatBox } from './chat-box';
import { CreateChatDialog } from './create-chat-dialog';
import '@/components/chat/chat.css';
import useChat, { useFetchChatData } from '@/hooks/use-chat';

export default function Index() {
  useFetchChatData();
  const setSelectedChat = useChat((state) => state.setSelectedChat);

  useEffect(() => {
    setSelectedChat(undefined);
  }, []);
  
  return (
    <> 
      <div className="chat-list w-full md:w-80 border-r border-border flex flex-col md:h-full h-2/5">
        <ChatList/>
      </div>

      <div className="chat-box flex-1 flex flex-col md:h-full h-3/5">
        <ChatBox/>
      </div>

      <CreateChatDialog/>
    </> 
  );
}

export function SkeletonIndex() {
  return (
    <>
      <div className="chat-list w-full md:w-80 border-r border-border flex flex-col md:h-full h-2/5">
        <ChatListSkeleton/>
      </div>
      <div className="chat-box flex-1 flex flex-col md:h-full h-3/5">
        <ChatListSkeleton/>
      </div>
    </>
  );
}