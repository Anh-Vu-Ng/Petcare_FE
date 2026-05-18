import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { Message } from '../../types/chat';
import { formatTime } from '../../utils/formatters';
import { cn } from '../ui/Button';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] sm:max-w-[75%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 shadow-sm",
          isUser ? "bg-blue-600 text-white ml-3" : "bg-teal-500 text-white mr-3"
        )}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div className={cn(
            "px-4 py-3 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed break-words",
            isUser 
              ? "bg-blue-600 text-white rounded-tr-sm" 
              : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
          )}>
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div className="prose prose-sm sm:prose-base prose-teal max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
                {/* Simulated typing indicator when content is empty */}
                {message.content === '' && (
                  <div className="flex space-x-1 items-center h-5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <span className={cn(
            "text-[11px] text-gray-400 mt-1.5 px-1",
            isUser ? "text-right" : "text-left"
          )}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
