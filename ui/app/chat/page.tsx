import '@/components/chat/chat.css';
import Index, { SkeletonIndex } from '@/components/chat';
import { Suspense } from 'react';


/**
 * Chat page component that displays a chat interface with chat list on the left
 * and chat box on the right, along with functionality to create new chats.
 * @return {JSX.Element} The rendered chat page component.
 * @author Cristono Wijaya
 */
export default function Chat() {
  return (
    <div className="chat-container flex h-[calc(100vh-var(--header-height)-1rem)] bg-background md:flex-row flex-col">
      <Suspense fallback={<SkeletonIndex/>}>
        <Index/>
      </Suspense>
    </div>
  );
}
