'use client';

import React, { useEffect } from 'react';
import QRCode from 'react-qr-code';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { AVAILABLE_SERVICES, BookingDetail } from '../../types/booking';
import {
  CheckCircle2,
  Copy,
  Printer,
  PlusCircle,
  MessageSquare,
  Calendar,
  Clock,
  User,
  X,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE_OUT, FAST_EXIT } from '../../utils/motion';

interface BookingConfirmationModalProps {
  booking: BookingDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onNewBooking: () => void;
  onSwitchToChat: () => void;
}

function getCorridorDotColor(serviceId?: string, serviceName?: string): string {
  const found = AVAILABLE_SERVICES.find(
    (s) => s.id === serviceId || s.name === serviceName
  );
  if (found?.category === 'medical') return 'bg-corridor-medical';
  if (found?.category === 'hotel') return 'bg-corridor-hotel';
  return 'bg-corridor-spa';
}

export function BookingConfirmationModal({
  booking,
  isOpen,
  onClose,
  onNewBooking,
  onSwitchToChat,
}: BookingConfirmationModalProps) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (isOpen && booking) {
      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#1E3A4C', '#B84A2D', '#1F6E4A', '#C88428'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, booking]);

  const handleCopyCode = () => {
    if (!booking) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(booking.booking_code);
      toast.success(`Đã sao chép mã đặt chỗ: ${booking.booking_code}`);
    } else {
      toast.info(`Mã đặt chỗ của bạn: ${booking.booking_code}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const petTypeLabel =
    booking?.pet_type === 'dog' ? 'Cún' : booking?.pet_type === 'cat' ? 'Mèo' : 'Thú cưng';

  const isOnlyMedical = Boolean(
    booking &&
      booking.has_quote_only_service &&
      ((booking.services.length === 1 && booking.services[0] === 'medical') ||
        booking.estimated_price <= 0)
  );

  return (
    <AnimatePresence>
      {isOpen && booking && (
        <motion.div
          key="confirmation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: FAST_EXIT }}
          transition={{ duration: 0.2 }}
          style={reduce ? undefined : { perspective: 1200 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--scrim-bg)] overflow-y-auto print:bg-white print:p-0 print:static"
        >
          <div className="fixed inset-0 print:hidden" onClick={onClose} />

          <motion.div
            initial={reduce ? { opacity: 0, rotateY: 0, scale: 1 } : { opacity: 0, rotateY: -90, scale: 0.96 }}
            animate={
              reduce
                ? { opacity: 1, rotateY: 0, scale: 1, transition: { duration: 0.2 } }
                : {
                    opacity: 1,
                    rotateY: 0,
                    scale: 1,
                    transition: { duration: 0.55, ease: EASE_OUT, delay: 0.08 },
                  }
            }
            exit={
              reduce
                ? { opacity: 0, rotateY: 0, scale: 1, transition: { duration: 0.2 } }
                : {
                    opacity: 0,
                    rotateY: 90,
                    scale: 0.96,
                    transition: { duration: 0.2, ease: 'easeIn' },
                  }
            }
            style={reduce ? undefined : { transformOrigin: 'center center' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-confirmed-title"
            className="relative w-full max-w-lg bg-surface-card rounded-[14px] shadow-[var(--shadow-modal)] border border-rim overflow-hidden z-10 my-8 print:my-0 print:shadow-none print:border-none print:transform-none"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng phiếu xác nhận"
              className="absolute top-3.5 right-3.5 z-20 p-2 rounded-[8px] bg-shell-surface hover:bg-shell-hover text-shell-ink-bright border border-shell-border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shell-ink-bright print:hidden"
            >
              <X size={16} />
            </button>

            {/* Engraved Header */}
            <div className="bg-shell-bg text-shell-ink-bright px-6 py-5 text-center border-b border-shell-header-border print:hidden">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-[10px] bg-state-success text-white mb-2.5">
                <CheckCircle2 size={24} />
              </div>

              <h2 id="booking-confirmed-title" className="text-lg sm:text-xl font-bold tracking-tight">
                Đặt lịch hẹn thành công
              </h2>
              <p className="text-xs text-shell-muted mt-1">
                Hệ thống đã ghi nhận lịch hẹn chăm sóc thú cưng của bạn
              </p>
            </div>

            {/* Printable Digital Check-In Pass */}
            <div className="p-5 sm:p-6 space-y-4" id="printable-ticket">
              {/* Brand strip included inside printable area */}
              <div className="flex items-center justify-between border-b border-rim pb-3">
                <div>
                  <span className="text-xs font-bold tracking-[0.04em] text-ink-slate uppercase block">
                    PETCARE · Phòng Khám &amp; Spa Thú Cưng
                  </span>
                  <span className="text-[11px] text-ink-secondary">
                    Phiếu hẹn dịch vụ &amp; check-in tại quầy
                  </span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-ink-secondary">
                  {booking.booking_date}
                </span>
              </div>

              {/* Collar-Tag Booking Code */}
              <div className="bg-surface-subtle border border-clay rounded-[11px] p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block">
                    Mã đặt chỗ
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-ink-slate font-mono tabular-nums tracking-wide">
                    {booking.booking_code}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-2 bg-surface-pure hover:bg-surface-card text-ink-slate border border-strong rounded-[8px] text-xs font-semibold transition-colors cursor-pointer print:hidden"
                >
                  <Copy size={14} />
                  <span>Sao chép</span>
                </button>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface-pure rounded-[10px] border border-rim">
                  <span className="text-ink-muted block text-[11px] mb-0.5">Khách hàng</span>
                  <span className="font-bold text-ink-primary flex items-center gap-1.5">
                    <User size={13} className="text-ink-slate" />
                    <span>{booking.customer_name}</span>
                  </span>
                  <span className="font-mono tabular-nums text-ink-secondary text-[11px] block mt-0.5">
                    {booking.customer_phone}
                  </span>
                </div>

                <div className="p-3 bg-surface-pure rounded-[10px] border border-rim">
                  <span className="text-ink-muted block text-[11px] mb-0.5">Bé cưng</span>
                  <span className="font-bold text-ink-primary block">
                    {booking.pet_name || 'Bé cưng'} ({petTypeLabel})
                  </span>
                  <span className="text-ink-slate font-mono tabular-nums font-semibold text-[11px] block mt-0.5">
                    Cân nặng: {booking.weight_kg} kg
                  </span>
                </div>

                <div className="p-3 bg-surface-pure rounded-[10px] border border-rim">
                  <span className="text-ink-muted block text-[11px] mb-0.5">Thời gian hẹn</span>
                  <span className="font-mono tabular-nums font-bold text-ink-slate flex items-center gap-1.5">
                    <Calendar size={13} className="text-ink-muted" />
                    <span>{booking.booking_date}</span>
                  </span>
                  <span className="font-mono tabular-nums font-bold text-ink-primary text-[11px] flex items-center gap-1.5 mt-0.5">
                    <Clock size={12} className="text-accent-collar-ink" />
                    <span>{booking.booking_time}</span>
                  </span>
                </div>

                <div className="p-3 bg-surface-pure rounded-[10px] border border-rim">
                  <span className="text-ink-muted block text-[11px] mb-0.5">Chi phí dự kiến</span>
                  {isOnlyMedical ? (
                    <span className="font-bold text-state-success-ink block">Bác sĩ báo giá sau</span>
                  ) : (
                    <>
                      <span className="font-mono tabular-nums font-bold text-accent-collar-ink text-sm block">
                        {booking.estimated_price.toLocaleString('vi-VN')}đ
                      </span>
                      {booking.has_quote_only_service && (
                        <span className="text-[10.5px] text-state-success-ink font-medium block mt-0.5">
                          + Khám bệnh báo giá sau
                        </span>
                      )}
                    </>
                  )}
                  <span className="text-[11px] text-state-warning-ink font-semibold block mt-0.5">
                    Trạng thái: Chờ duyệt
                  </span>
                </div>
              </div>

              {/* Services */}
              <div className="p-3.5 bg-surface-pure rounded-[10px] border border-rim">
                <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block mb-2">
                  Dịch vụ đã đăng ký ({booking.service_names.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {booking.service_names.map((sName, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] text-xs font-semibold bg-surface-subtle text-ink-primary border border-rim"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getCorridorDotColor(booking.services[idx], sName)}`}
                        aria-hidden="true"
                      />
                      <span>{sName}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* QR Check-In Pass */}
              <div className="border-t border-dashed border-strong pt-4 flex items-center justify-between gap-4">
                <div className="space-y-1 max-w-[260px]">
                  <span className="text-xs font-bold text-ink-primary block">
                    Mã QR Check-in Tại Quầy
                  </span>
                  <p className="text-[11px] text-ink-secondary leading-relaxed">
                    Xuất trình mã này cho nhân viên lễ tân khi đưa bé đến phòng khám.
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-state-success-ink font-semibold pt-1">
                    <ShieldCheck size={13} />
                    <span>Xác thực tự động không cần xếp hàng</span>
                  </div>
                </div>

                <div className="p-2 bg-white border border-clay rounded-[10px] flex-shrink-0">
                  <QRCode value={`PETCARE-CHECKIN:${booking.booking_code}`} size={76} level="M" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-surface-subtle p-4 border-t border-rim flex flex-col sm:flex-row items-center gap-2 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-[9px] bg-surface-pure hover:bg-surface-card text-ink-primary border border-strong text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer size={15} />
                <span>In / Lưu Phiếu</span>
              </button>

              <button
                type="button"
                onClick={onNewBooking}
                className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-[9px] bg-surface-pure hover:bg-surface-card text-ink-slate border border-control-active-border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>Đặt Thêm Lịch</span>
              </button>

              <button
                type="button"
                onClick={onSwitchToChat}
                className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-[9px] bg-accent-collar hover:bg-accent-collar-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare size={15} />
                <span>Chat Với AI</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
