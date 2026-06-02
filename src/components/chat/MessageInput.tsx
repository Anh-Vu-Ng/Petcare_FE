import React, { useState, useRef, KeyboardEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { cn } from '../ui/Button';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (content.trim() && !isLoading) {
      onSendMessage(content.trim());
      setContent('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto expand textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const computed = window.getComputedStyle(textareaRef.current);
      const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + parseInt(computed.getPropertyValue('padding-top'), 10)
        + textareaRef.current.scrollHeight
        + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

      textareaRef.current.style.height = `${Math.min(height, 150)}px`;
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-100 relative z-10 w-full">
      <div className="w-full relative">
        {/* Glowing RGB Neon border capsule (White background inner) */}
        <div className="relative flex items-end bg-white rgb-neon-border rounded-3xl p-2 pl-4 pr-3 shadow-md">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Bạn có điều gì cần giúp đỡ hong ..."
            className="flex-1 max-h-[150px] min-h-[40px] py-2 bg-transparent resize-none focus:outline-none overflow-y-auto text-slate-800 placeholder-slate-400 text-sm sm:text-base leading-relaxed scrollbar-none"
            rows={1}
            disabled={isLoading}
          />
          
          {/* Action icons row inside input capsule */}
          <div className="flex items-center h-10 ml-2">
            <button
              onClick={handleSend}
              disabled={!content.trim() || isLoading}
              className={cn(
                "p-2 rounded-full transition-all duration-300 active:scale-90 flex-shrink-0 cursor-pointer",
                content.trim() && !isLoading
                  ? "bg-gradient-to-tr from-teal-500 to-blue-500 text-white shadow-md shadow-teal-500/10 hover:brightness-110"
                  : "bg-slate-100 text-slate-300 disabled:cursor-not-allowed"
              )}
            >
              <SendHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="text-center mt-2 text-[10px] text-slate-400 tracking-wide select-none">
        Petcare chatbot có thể đưa ra thông tin không chính xác. Hãy đưa pet tới cửa hàng để được chăm sóc tốt nhất nhé!
      </div>
    </div>
  );
}
