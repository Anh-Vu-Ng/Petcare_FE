import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/Button';

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
    <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-5px_15px_-15px_rgba(0,0,0,0.1)] relative z-10 rounded-b-2xl">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="relative flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/20 transition-all shadow-inner overflow-hidden">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi về cách chăm sóc thú cưng của bạn..."
            className="w-full max-h-[150px] min-h-[50px] py-3 pl-4 pr-12 bg-transparent resize-none focus:outline-none scrollbar-thin overflow-y-auto text-gray-700 leading-relaxed"
            rows={1}
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!content.trim() || isLoading}
          variant="icon"
          className="h-12 w-12 rounded-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:opacity-70 transition-transform active:scale-95 shadow-md flex-shrink-0"
        >
          <Send size={20} className={content.trim() && !isLoading ? "text-white" : "text-gray-100"} />
        </Button>
      </div>
      <div className="text-center mt-2 text-xs text-gray-400">
        Petcare RAG có thể mắc lỗi. Vui lòng kiểm tra lại các thông tin quan trọng.
      </div>
    </div>
  );
}
