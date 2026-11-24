'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ChatStatus = 'idle' | 'sending' | 'thinking' | 'streaming';

interface StatusPuppyProps {
  status: ChatStatus;
}

export function StatusPuppy({ status }: StatusPuppyProps) {
  const isSending = status === 'sending';
  const isThinking = status === 'thinking';
  const isStreaming = status === 'streaming';

  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex items-center gap-3.5 px-4 py-3 rounded-[12px] bg-surface-pure border border-rim max-w-max my-2.5 ml-10.5"
        >
          {/* Warm Line-and-Wash Shiba Companion Emblem */}
          <div className="flex-shrink-0 w-10 h-10 relative">
            <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
              {/* Ears */}
              <polygon
                points="14,27 20,8 28,22"
                fill="#D4793B"
                stroke="#231F1D"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <polygon points="17,24 20.5,12.5 25,21" fill="#F2D7C4" />
              <polygon
                points="50,27 44,8 36,22"
                fill="#D4793B"
                stroke="#231F1D"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <polygon points="47,24 43.5,12.5 39,21" fill="#F2D7C4" />

              {/* Head */}
              <ellipse
                cx="32"
                cy="34"
                rx="18"
                ry="16"
                fill="#F2B880"
                stroke="#231F1D"
                strokeWidth="1.5"
              />
              {/* Cream Cheek Mask */}
              <path
                d="M17,36 Q23,28 32,29 Q41,28 47,36 Q43,48 32,49 Q21,48 17,36 Z"
                fill="#FAF4EA"
              />

              {/* Eyes */}
              {isStreaming ? (
                <>
                  <path
                    d="M22,32 Q25,29 28,32"
                    stroke="#231F1D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M36,32 Q39,29 42,32"
                    stroke="#231F1D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              ) : (
                <>
                  <circle cx="25" cy="31.5" r="2.3" fill="#231F1D" />
                  <circle cx="24.3" cy="30.8" r="0.7" fill="#FFFFFF" />
                  <circle cx="39" cy="31.5" r="2.3" fill="#231F1D" />
                  <circle cx="38.3" cy="30.8" r="0.7" fill="#FFFFFF" />
                </>
              )}

              {/* Nose & Smile */}
              <ellipse cx="32" cy="37" rx="2.6" ry="1.8" fill="#231F1D" />
              <path
                d="M28.5,40.5 Q32,43 35.5,40.5"
                stroke="#231F1D"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Collar Tag */}
              <path
                d="M20,48 Q32,53 44,48"
                stroke="#B84A2D"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="32" cy="52" r="2.5" fill="#1E3A4C" stroke="#FAF9F6" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs sm:text-[13px] font-semibold text-ink-primary leading-tight">
              {isSending && 'Đang tiếp nhận câu hỏi...'}
              {isThinking && 'Đang tra cứu thông tin chăm sóc...'}
              {isStreaming && 'Đang tổng hợp phản hồi...'}
            </span>
            <span className="text-[11px] text-ink-secondary leading-snug">
              {isSending && 'Petcare đang ghi nhận thông tin cho bé cưng'}
              {isThinking && 'Đang kiểm tra tài liệu chuyên môn và bảng giá'}
              {isStreaming && 'Đang hiển thị chi tiết câu trả lời'}
            </span>

            {isThinking && (
              <div className="flex gap-1.5 mt-1" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-accent-collar-ink"
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.18,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
