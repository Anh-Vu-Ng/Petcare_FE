'use client';

import React, { useState } from 'react';
import { ChatBox } from '../components/chat/ChatBox';
import { BookingContainer } from '../components/booking/BookingContainer';
import { BookingLookupTab } from '../components/booking/BookingLookupTab';
import { MessageSquare, CalendarCheck, Search, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabKey = 'chat' | 'booking' | 'lookup';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>('booking');
  const [prefillService, setPrefillService] = useState<string | undefined>(undefined);

  const handleOpenBooking = (serviceId?: string) => {
    setPrefillService(serviceId);
    setActiveTab('booking');
  };

  return (
    <main className="min-h-screen w-full bg-slate-50/60 text-[#1e293b] flex flex-col relative overflow-x-hidden">
      {/* Background cute blur decoration blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Cute Floating Animal SVG Decorations (Background) */}
      <div className="fixed left-[3%] top-[18%] hidden lg:block animate-float-slow pointer-events-none select-none -z-10 opacity-70">
        <svg viewBox="0 0 100 100" className="w-18 h-18 text-teal-400/40 fill-current">
          <polygon points="20,40 35,10 45,35" />
          <polygon points="80,40 65,10 55,35" />
          <ellipse cx="50" cy="55" rx="35" ry="25" />
          <circle cx="38" cy="50" r="4.5" fill="#475569" />
          <circle cx="62" cy="50" r="4.5" fill="#475569" />
          <polygon points="50,58 47,55 53,55" fill="#f43f5e" />
          <path d="M47,62 Q50,65 53,62" stroke="#475569" strokeWidth="2.5" fill="none" />
          <line x1="20" y1="55" x2="4" y2="53" stroke="#475569" strokeWidth="1.5" opacity="0.6" />
          <line x1="20" y1="60" x2="2" y2="62" stroke="#475569" strokeWidth="1.5" opacity="0.6" />
          <line x1="80" y1="55" x2="96" y2="53" stroke="#475569" strokeWidth="1.5" opacity="0.6" />
          <line x1="80" y1="60" x2="98" y2="62" stroke="#475569" strokeWidth="1.5" opacity="0.6" />
        </svg>
      </div>

      <div className="fixed right-[3%] top-[20%] hidden lg:block animate-float-slower pointer-events-none select-none -z-10 opacity-70">
        <svg viewBox="0 0 100 100" className="w-18 h-18 text-indigo-400/40 fill-current">
          <ellipse cx="50" cy="50" rx="32" ry="28" />
          <path d="M18,35 Q8,55 18,65" stroke="#818cf8" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M82,35 Q92,55 82,65" stroke="#818cf8" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="38" cy="45" r="4.5" fill="#475569" />
          <circle cx="62" cy="45" r="4.5" fill="#475569" />
          <ellipse cx="50" cy="60" rx="12" ry="9" fill="#f8fafc" />
          <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#1e293b" />
          <line x1="50" y1="59" x2="50" y2="65" stroke="#1e293b" strokeWidth="2" />
        </svg>
      </div>

      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Heart size={20} fill="white" className="text-white" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent block leading-tight">
                PETCARE
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Phòng Khám & Spa Thú Cưng
              </span>
            </div>
          </div>

          {/* Navigation Tabs Pill Switcher */}
          <nav className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 shadow-inner">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
                activeTab === 'chat'
                  ? 'bg-white text-teal-700 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <MessageSquare size={16} className={activeTab === 'chat' ? 'text-teal-500' : ''} />
              <span>Tư Vấn AI</span>
            </button>

            <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none relative ${
                activeTab === 'booking'
                  ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CalendarCheck size={16} />
              <span>Đặt Lịch Hẹn</span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-amber-950 uppercase tracking-tighter">
                HOT
              </span>
            </button>

            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
                activeTab === 'lookup'
                  ? 'bg-white text-teal-700 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Search size={16} className={activeTab === 'lookup' ? 'text-teal-500' : ''} />
              <span>Tra Cứu</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 z-10 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div
              key="tab-chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-120px)] min-h-[500px]"
            >
              <ChatBox />
            </motion.div>
          )}

          {activeTab === 'booking' && (
            <motion.div
              key="tab-booking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full pb-12"
            >
              <BookingContainer
                prefillService={prefillService}
                onSwitchToChat={() => setActiveTab('chat')}
              />
            </motion.div>
          )}

          {activeTab === 'lookup' && (
            <motion.div
              key="tab-lookup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full pb-12"
            >
              <BookingLookupTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
