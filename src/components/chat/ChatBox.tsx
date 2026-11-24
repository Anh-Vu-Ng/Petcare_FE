'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { computeClientEstimate } from '../../services/bookingApi';
import { EASE_OUT, FAST_EXIT } from '../../utils/motion';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import {
  MapPin,
  Phone,
  Stethoscope,
  Sparkles,
  RotateCcw,
  CalendarCheck,
} from 'lucide-react';

interface ChatBoxProps {
  weightKg?: number;
  onOpenBooking?: (serviceId?: string) => void;
}

export function ChatBox({
  weightKg = 5,
  onOpenBooking,
}: ChatBoxProps) {
  const { messages, isLoading, sendMessage, chatStatus, clearChat } = useChat();
  const reduce = useReducedMotion();

  const suggestions = [
    {
      title: 'Địa chỉ & Giờ mở cửa',
      desc: 'Xem thông tin địa chỉ phòng khám và khung giờ tiếp đón bé cưng.',
      icon: <MapPin size={17} className="text-ink-slate" />,
      prompt: 'Địa chỉ cửa hàng Petcare ở đâu?',
    },
    {
      title: 'Kênh liên hệ nhanh',
      desc: 'Các kênh liên hệ chính thức với Petcare khi cần hỗ trợ gấp.',
      icon: <Phone size={17} className="text-state-warning-ink" />,
      prompt: 'Có thể liên hệ với Petcare qua những kênh nào?',
    },
    {
      title: 'Danh mục dịch vụ chăm sóc',
      desc: 'Tổng hợp các dịch vụ tắm spa, cắt tỉa, khám bệnh và lưu trú 24h.',
      icon: <Stethoscope size={17} className="text-state-success-ink" />,
      prompt: 'Petcare có các dịch vụ nào?',
    },
    {
      title: 'Bảng giá làm đẹp theo cân nặng',
      desc: 'Tư vấn các dịch vụ làm đẹp cho bé và chi phí tham khảo theo số kg.',
      icon: <Sparkles size={17} className="text-accent-collar-ink" />,
      prompt: 'Tư vấn các dịch vụ làm đẹp cho thú cưng và bảng giá tham khảo theo cân nặng?',
    },
  ];

  const bathPrice = useMemo(
    () => computeClientEstimate(['bath'], weightKg, 1).final_total,
    [weightKg]
  );

  return (
    <div className="w-full">
      {/* Main Consultation Desk */}
      <section className="flex flex-col w-full h-[calc(100dvh-140px)] lg:h-[calc(100vh-124px)] min-h-[520px] bg-surface-card rounded-[14px] border border-rim overflow-hidden">
        {/* Desk Header */}
        <header className="py-3 px-4 sm:px-5 bg-surface-subtle border-b border-rim flex items-center justify-between flex-shrink-0 gap-3">
          <div className="min-w-0">
            <h1 className="font-bold text-base sm:text-lg text-ink-primary leading-tight">
              Bàn Tư Vấn Petcare
            </h1>
            <p className="text-xs text-ink-secondary mt-0.5 leading-snug">
              Giải đáp sức khỏe, tắm spa &amp; chi phí chăm sóc
            </p>
          </div>

          <button
            type="button"
            onClick={clearChat}
            disabled={isLoading || messages.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-surface-card border border-strong text-ink-slate hover:bg-surface-pure active:scale-[0.98] transition-colors text-xs font-semibold cursor-pointer select-none disabled:bg-surface-subtle disabled:text-ink-secondary disabled:border-clay disabled:opacity-75 disabled:pointer-events-none flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title="Xóa lịch sử và bắt đầu cuộc trò chuyện mới"
          >
            <RotateCcw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </button>
        </header>

        {/* Conversation Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-surface-card">
          <AnimatePresence mode="wait" initial={false}>
            {messages.length === 0 ? (
              <motion.div
                key="empty"
                exit={
                  reduce
                    ? { opacity: 0, transition: FAST_EXIT }
                    : { opacity: 0, scale: 0.98, y: -8, transition: FAST_EXIT }
                }
                className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-5 flex flex-col"
              >
                <div className="max-w-2xl w-full mx-auto my-auto">
                  {/* 2x2 Topic Grid */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3"
                  >
                    {suggestions.map((item) => (
                      <motion.button
                        key={item.title}
                        type="button"
                        variants={{
                          hidden: { opacity: 0, y: reduce ? 0 : 10 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: reduce ? 0.16 : 0.3, ease: EASE_OUT },
                          },
                        }}
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                        onClick={() => sendMessage(item.prompt)}
                        className="flex flex-col text-left p-4 rounded-[10px] bg-surface-pure border border-rim hover:border-control-active-border hover:bg-surface-card transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="p-1.5 rounded-[8px] bg-surface-subtle border border-rim group-hover:bg-surface-pure group-hover:-translate-y-0.5 group-hover:rotate-[-4deg] transition-[background-color,transform] motion-reduce:transform-none">
                            {item.icon}
                          </span>
                          <span className="text-sm font-semibold text-ink-primary group-hover:text-ink-slate transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
                          {item.desc}
                        </p>
                      </motion.button>
                    ))}
                  </motion.div>

                  {/* Quick Jump to Booking */}
                  {onOpenBooking && (
                    <div className="mt-4 flex items-center justify-between gap-3 p-3.5 rounded-[10px] bg-surface-subtle border border-rim">
                      <div className="text-xs text-ink-primary">
                        <span className="font-semibold block">Cần đặt lịch ngay cho bé?</span>
                        <span className="text-ink-secondary">
                          Tắm Spa từ <strong className="font-mono tabular-nums text-ink-slate">{bathPrice.toLocaleString('vi-VN')}đ</strong> ({weightKg} kg)
                        </span>
                      </div>
                      <motion.button
                        type="button"
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                        onClick={() => onOpenBooking('bath')}
                        className="px-3.5 py-2 rounded-[8px] bg-accent-collar hover:bg-accent-collar-hover text-white text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                      >
                        <CalendarCheck size={14} />
                        <span>Đặt lịch</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: FAST_EXIT }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="flex-1 overflow-hidden flex flex-col"
              >
                <MessageList messages={messages} chatStatus={chatStatus} />
              </motion.div>
            )}
          </AnimatePresence>

          <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
