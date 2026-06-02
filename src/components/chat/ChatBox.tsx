'use client';

import React from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Sparkles, HeartPulse, ShieldAlert, Syringe, Bath, Activity, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export function ChatBox() {
  const { messages, isLoading, sendMessage, chatStatus, clearChat } = useChat();

  const suggestions = [
    {
      title: "Địa chỉ",
      desc: "Địa chỉ cửa hàng Petcare ở đâu",
      icon: <HeartPulse size={20} className="text-teal-500" />,
      prompt: "Địa chỉ cửa hàng Petcare ở đâu?"
    },
    {
      title: "Liên hệ",
      desc: "Có thể liên hệ với Petcare qua những kênh nào?",
      icon: <ShieldAlert size={20} className="text-amber-500" />,
      prompt: "Có thể liên hệ với Petcare qua những kênh nào?"
    },
    {
      title: "Dịch vụ làm đẹp",
      desc: "Tư vấn các dịch vụ làm đẹp cho pet có giá tham khảo ",
      icon: <Syringe size={20} className="text-blue-500" />,
      prompt: "xin chào"
    },
    {
      title: "Dịch vụ khác",
      desc: "Petcare có các dịch vụ nào",
      icon: <Bath size={20} className="text-purple-500" />,
      prompt: "Petcare có các dịch vụ nào"
    }
  ];

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative">
      {/* Cute Stethoscope Header */}
      <header className="py-2.5 px-5 bg-gradient-to-r from-teal-500 to-teal-400 text-white flex items-center justify-between shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base leading-tight">Trợ lý ảo Petcare</h2>
            <p className="text-[9.5px] text-teal-50/90 tracking-wide leading-none">Trò chuyện hỏi đáp thông tin chăm sóc thú cưng</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          disabled={isLoading || messages.length === 0}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/10 hover:border-white/20 transition-all text-xs font-semibold text-white/90 hover:text-white cursor-pointer select-none disabled:opacity-30 disabled:pointer-events-none"
          title="Xóa lịch sử và làm mới hội thoại"
        >
          <RotateCcw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Làm mới</span>
        </button>
      </header>

      {/* Main chat body */}
      <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto px-6 py-8 md:py-12 flex flex-col items-center justify-center w-full scrollbar-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4 p-3 bg-teal-50 rounded-2xl border border-teal-100"
            >
              <Sparkles size={32} className="text-teal-500" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center mb-8 md:mb-10"
            >
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                <span className="text-slate-700">Chào bạn, mình là </span>
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Petcare Assistant
                </span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Mình có thể giúp gì cho chó/mèo của bạn hôm nay? Hãy chọn một chủ đề bên dưới hoặc gõ câu hỏi nhé!
              </p>
            </motion.div>

            {/* Suggestions list */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(item.prompt)}
                  className="flex flex-col text-left p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-300 hover:bg-teal-50/20 transition-all duration-300 group cursor-pointer shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center space-x-3 mb-2 relative z-10">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-teal-100 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-teal-600 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors line-clamp-2 leading-relaxed relative z-10">
                    {item.desc}
                  </p>
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          <MessageList messages={messages} chatStatus={chatStatus} />
        )}
        
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
