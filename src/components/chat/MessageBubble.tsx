import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full mb-6 first:mt-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex w-full max-w-[88%]",
        isUser ? "justify-end pl-4" : "justify-start pr-4"
      )}>
        {/* Cute Avatar */}
        <div className={cn(
          "flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center mt-1 shadow-sm border",
          isUser 
            ? "bg-amber-100 border-amber-200 text-amber-600 order-2 ml-3" 
            : "bg-gradient-to-tr from-teal-500 to-emerald-400 border-transparent text-white order-1 mr-3"
        )}>
          {isUser ? <User size={15} /> : <Sparkles size={15} />}
        </div>

        {/* Message Bubble & Time */}
        <div className={cn(
          "flex flex-col order-2",
          isUser ? "items-end order-1" : "items-start"
        )}>
          {/* Bubble wrapper */}
          <div className={cn(
            "px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm border",
            isUser 
              ? "bg-teal-500 border-transparent text-white rounded-tr-sm" 
              : "bg-white border-slate-100 text-slate-800 rounded-tl-sm w-full prose prose-sm sm:prose-base max-w-none"
          )}>
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              message.content === '' ? (
                /* Shimmering Placeholder Lines (Light theme) */
                <div className="space-y-3 py-1 w-[160px] sm:w-[320px]">
                  <div className="h-2.5 bg-slate-100 rounded-full w-full shimmer-loading" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[85%] shimmer-loading" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[60%] shimmer-loading" />
                </div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              )
            )}
          </div>
          
          {/* Timestamp */}
          <span className="text-[9px] text-slate-400 mt-1 px-1 tracking-wider">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
