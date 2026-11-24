'use client';

import React, { useState } from 'react';
import { ChatBox } from '../components/chat/ChatBox';
import { BookingContainer } from '../components/booking/BookingContainer';
import { BookingLookupTab } from '../components/booking/BookingLookupTab';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { PetType } from '../types/booking';
import { MessageSquare, CalendarCheck, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../utils/motion';

type TabKey = 'chat' | 'booking' | 'lookup';
const TAB_ORDER: TabKey[] = ['chat', 'booking', 'lookup'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>('chat');
  const [direction, setDirection] = useState<number>(1);
  const [hasSwitched, setHasSwitched] = useState<boolean>(false);
  const [prefillService, setPrefillService] = useState<string | undefined>(undefined);
  const [petType] = useState<PetType>('dog');
  const [weightKg] = useState<number>(5);
  const reduce = useReducedMotion();

  const changeTab = (nextTab: TabKey) => {
    if (nextTab === activeTab) return;
    const prevIdx = TAB_ORDER.indexOf(activeTab);
    const nextIdx = TAB_ORDER.indexOf(nextTab);
    setDirection(nextIdx >= prevIdx ? 1 : -1);
    setHasSwitched(true);
    setActiveTab(nextTab);
  };

  const handleOpenBooking = (serviceId?: string) => {
    setPrefillService(serviceId);
    changeTab('booking');
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'chat', label: 'Tư Vấn AI', icon: <MessageSquare size={16} /> },
    { key: 'booking', label: 'Đặt Lịch Hẹn', icon: <CalendarCheck size={16} /> },
    { key: 'lookup', label: 'Tra Cứu', icon: <Search size={16} /> },
  ];

  return (
    <div className="min-h-screen w-full bg-surface-ground text-ink-primary flex flex-col">
      {/* Top Workspace Header — Glazed Slate Ceramic Shell */}
      <header className="sticky top-0 z-40 w-full bg-shell-bg text-shell-ink border-b border-shell-header-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-16 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo — Bespoke Collar-Tag Emblem */}
          <div className="order-1 flex items-center gap-3">
            <svg
              viewBox="0 0 36 36"
              className="w-9 h-9 flex-shrink-0"
              aria-hidden="true"
            >
              <circle cx="18" cy="18" r="17" fill="#B84A2D" stroke="#F4F2ED" strokeWidth="1.5" />
              <circle cx="18" cy="5.5" r="1.75" fill="#1E3A4C" stroke="#F4F2ED" strokeWidth="1" />
              <ellipse cx="18" cy="21.5" rx="5.2" ry="4.4" fill="#FAF9F6" />
              <circle cx="11.5" cy="15.5" r="2.1" fill="#FAF9F6" />
              <circle cx="15.5" cy="12.5" r="2.1" fill="#FAF9F6" />
              <circle cx="20.5" cy="12.5" r="2.1" fill="#FAF9F6" />
              <circle cx="24.5" cy="15.5" r="2.1" fill="#FAF9F6" />
            </svg>
            <div>
              <span className="text-base font-bold tracking-[0.04em] text-shell-ink-bright block leading-tight">
                PETCARE
              </span>
              <span className="text-[11px] text-shell-muted font-medium tracking-wide block">
                Phòng Khám &amp; Spa Thú Cưng
              </span>
            </div>
          </div>

          {/* Workflow Navigation Tabs */}
          <nav
            role="tablist"
            aria-label="Chức năng chính Petcare"
            className="order-3 lg:order-2 flex items-center bg-shell-surface p-1 rounded-[10px] border border-shell-border w-full lg:w-auto justify-between lg:justify-start"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => changeTab(tab.key)}
                  className={`relative flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 min-h-9 py-1.5 rounded-[7px] text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shell-ink-bright ${
                    isActive
                      ? 'text-white'
                      : 'text-shell-tab-idle hover:text-white hover:bg-shell-hover'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-tab-pill"
                      className="absolute inset-0 rounded-[7px] bg-accent-collar"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {tab.icon}
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Theme Mode Toggle */}
          <div className="order-2 lg:order-3 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col justify-start">
        {activeTab === 'chat' && (
          <motion.div
            key="tab-chat"
            initial={hasSwitched ? { opacity: 0, x: reduce ? 0 : direction * 12 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="w-full flex flex-col"
          >
            <ChatBox
              weightKg={weightKg}
              onOpenBooking={handleOpenBooking}
            />
          </motion.div>
        )}

        {activeTab === 'booking' && (
          <motion.div
            key="tab-booking"
            initial={hasSwitched ? { opacity: 0, x: reduce ? 0 : direction * 12 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="w-full pb-12"
          >
            <BookingContainer
              prefillService={prefillService}
              initialPetType={petType}
              initialWeightKg={weightKg}
              onSwitchToChat={() => changeTab('chat')}
            />
          </motion.div>
        )}

        {activeTab === 'lookup' && (
          <motion.div
            key="tab-lookup"
            initial={hasSwitched ? { opacity: 0, x: reduce ? 0 : direction * 12 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="w-full pb-12"
          >
            <BookingLookupTab />
          </motion.div>
        )}
      </main>
    </div>
  );
}
