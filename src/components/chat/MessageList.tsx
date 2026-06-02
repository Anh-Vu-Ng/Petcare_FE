import React, { useEffect, useRef } from 'react';
import { Message } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { ChatStatus, StatusPuppy } from './StatusPuppy';

interface MessageListProps {
  messages: Message[];
  chatStatus: ChatStatus;
}

  export function MessageList({ messages, chatStatus }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatStatus]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 no-scrollbar"
    >
      <div className="w-full flex flex-col py-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <StatusPuppy status={chatStatus} />
      </div>
    </div>
  );
}
