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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const computed = window.getComputedStyle(textareaRef.current);
      const height =
        parseInt(computed.getPropertyValue('border-top-width'), 10) +
        parseInt(computed.getPropertyValue('padding-top'), 10) +
        textareaRef.current.scrollHeight +
        parseInt(computed.getPropertyValue('padding-bottom'), 10) +
        parseInt(computed.getPropertyValue('border-bottom-width'), 10);

      textareaRef.current.style.height = `${Math.min(height, 144)}px`;
    }
  };

  const canSend = Boolean(content.trim() && !isLoading);

  return (
    <div className="p-3.5 sm:p-4 bg-surface-card border-t border-rim w-full flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-surface-pure border border-strong focus-within:border-control-active-border focus-within:ring-2 focus-within:ring-focus-ring/20 rounded-[12px] pl-3.5 pr-2 py-2 transition-colors">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi về chăm sóc, spa hoặc đặt lịch..."
            aria-label="Nhập câu hỏi tư vấn chăm sóc thú cưng"
            className="flex-1 max-h-[144px] min-h-[38px] py-1.5 bg-transparent resize-none focus:outline-none overflow-y-auto text-ink-primary placeholder-ink-muted text-sm sm:text-[15px] leading-relaxed no-scrollbar"
            rows={1}
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Gửi tin nhắn"
            className={cn(
              'h-9 px-3.5 rounded-[9px] transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold flex-shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
              canSend
                ? 'bg-accent-collar hover:bg-accent-collar-hover text-white'
                : 'bg-surface-subtle text-ink-disabled disabled:cursor-not-allowed'
            )}
          >
            <span className="hidden sm:inline">Gửi</span>
            <SendHorizontal size={15} />
          </button>
        </div>
        <p className="text-center mt-2 text-[11px] text-ink-muted">
          Thông tin tư vấn mang tính tham khảo. Với biểu hiện bất thường, vui lòng đặt lịch để bác sĩ thú y thăm khám trực tiếp.
        </p>
      </div>
    </div>
  );
}
