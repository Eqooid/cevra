'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SendIcon, MessageSquareIcon } from 'lucide-react';
import useChat, { Message } from '@/hooks/use-chat';
import { Skeleton } from '../ui/skeleton';

/**
 * ChatBox component that displays the chat conversation and input for sending messages.
 * Implements streaming-like message display.
 * @param {ChatBoxProps} props - The component props.
 * @return {JSX.Element} The rendered chat box component.
 * @author Cristono Wijaya
 */
export function ChatBox() {
  const chat = useChat(state => state.selectedChat);
  const sendingMessage = useChat(state => state.handleSendMessage);
  const isStreaming = useChat(state => state.isStreaming);
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = false) => {
    if (smooth) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (chat) {
      scrollToBottom(false);
    }
  }, [chat, chat?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !chat) return;
    sendingMessage(inputValue, () => {
      scrollToBottom(true);
    });
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageSquareIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Select a chat to start</h3>
        <p className="text-muted-foreground">
          Choose a chat from the list or create a new one to begin your conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-background/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{chat.name}</h2>
            {chat.description && (
              <p className="text-sm text-muted-foreground">{chat.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {chat.storageName}
            </Badge>
            <Badge variant="secondary">
              {chat.messages.length} messages
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-muted-foreground mb-2">No messages yet</div>
            <p className="text-sm text-muted-foreground">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          <>
            {chat.messages.map((message) => {
              return <MessageBubble key={message.id} message={message} />
            })}
            {isStreaming && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] p-3 bg-muted">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is typing...</span>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-10 resize-none"
              disabled={isStreaming}
            />
          </div>
          <Button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
            size="lg"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}

/**
 * MessageBubble component that displays individual chat messages.
 * @param {Object} props - The component props.
 * @param {Message} props.message - The message to display.
 * @return {JSX.Element} The rendered message bubble component.
 */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card className={`max-w-[80%] p-3 ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      }`}>
        <div className="space-y-2">
          <div className="text-sm whitespace-pre-wrap wrap-break-word">
            {message.content}
          </div>
          <div className={`text-xs ${
            isUser 
              ? 'text-primary-foreground/70' 
              : 'text-muted-foreground'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * ChatBoxSkeleton component that displays a skeleton loader for the chat box.
 * @return {JSX.Element} The rendered chat box skeleton component.
 * @author Cristono Wijaya
 */
export function ChatBoxSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header Skeleton */}
      <div className="p-4 border-b border-border bg-background/50">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      {/* Messages Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex justify-start">
            <Skeleton className="h-10 w-1/2" />
          </div>
        ))}
      </div>
      {/* Input Area Skeleton */}
      <div className="p-4 border-t border-border bg-background/50">
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}