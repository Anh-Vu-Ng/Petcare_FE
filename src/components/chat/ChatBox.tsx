'use client';

import React from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Stethoscope } from 'lucide-react';

export function ChatBox() {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="flex flex-col w-full h-[85vh] max-h-[800px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 ring-1 ring-black/5">
      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white z-10 shadow-sm">
        <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mr-4 shadow-inner">
          <Stethoscope size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-wide">Petcare Assistant</h2>
          <p className="text-teal-50 text-xs opacity-90">Trợ lý ảo thông minh của Petcare</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50/50">
        <MessageList messages={messages} />
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
