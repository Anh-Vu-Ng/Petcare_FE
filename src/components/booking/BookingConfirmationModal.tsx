'use client';

import React, { useEffect } from 'react';
import QRCode from 'react-qr-code';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { BookingDetail } from '../../types/booking';
import {
  CheckCircle2,
  Copy,
  Printer,
  PlusCircle,
  MessageSquare,
  Calendar,
  Clock,
  User,
  Phone,
  Sparkles,
  X,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingConfirmationModalProps {
  booking: BookingDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onNewBooking: () => void;
  onSwitchToChat: () => void;
}

export function BookingConfirmationModal({
  booking,
  isOpen,
  onClose,
  onNewBooking,
  onSwitchToChat,
}: BookingConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire congratulatory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#14b8a6', '#f59e0b', '#6366f1'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handleCopyCode = () => {
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
    booking.pet_type === 'dog' ? 'Cún' : booking.pet_type === 'cat' ? 'Mèo' : 'Thú cưng';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 text-white p-6 text-center relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mb-2 shadow-inner">
              <CheckCircle2 size={28} className="text-white" />
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
              ĐẶT LỊCH HẸN THÀNH CÔNG!
            </h2>
            <p className="text-xs text-teal-100 mt-0.5">
              Hệ thống đã ghi nhận lịch hẹn chăm sóc thú cưng của bạn
            </p>
          </div>

          {/* Digital Boarding Pass Body */}
          <div className="p-6 space-y-5" id="printable-ticket">
            {/* Booking Code Card */}
            <div className="bg-gradient-to-r from-teal-50 via-slate-50 to-teal-50 border border-teal-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  MÃ ĐẶT CHỖ (BOOKING CODE)
                </span>
                <span className="text-xl sm:text-2xl font-black text-teal-700 font-mono tracking-wider">
                  {booking.booking_code}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Copy size={14} />
                <span>Sao Chép</span>
              </button>
            </div>

            {/* Ticket Information Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-0.5">Khách hàng</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <User size={13} className="text-teal-600" />
                  {booking.customer_name}
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  {booking.customer_phone}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-0.5">Bé cưng</span>
                <span className="font-bold text-slate-800">
                  {booking.pet_name || 'Bé cưng'} ({petTypeLabel})
                </span>
                <span className="text-teal-600 font-semibold text-[11px] block mt-0.5">
                  Cân nặng: {booking.weight_kg} kg
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-0.5">Thời gian hẹn</span>
                <span className="font-bold text-teal-700 flex items-center gap-1">
                  <Calendar size={13} className="text-teal-600" />
                  {booking.booking_date}
                </span>
                <span className="font-extrabold text-slate-800 text-[11px] flex items-center gap-1 mt-0.5">
                  <Clock size={12} className="text-amber-500" />
                  {booking.booking_time}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-0.5">Chi phí dự kiến</span>
                {booking.has_quote_only_service ? (
                  <span className="font-bold text-emerald-700 block">
                    Bác sĩ báo giá sau
                  </span>
                ) : (
                  <span className="font-extrabold text-teal-700 text-sm block">
                    {booking.estimated_price.toLocaleString('vi-VN')}đ
                  </span>
                )}
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Trạng thái: <b className="text-amber-600">Chờ duyệt</b>
                </span>
              </div>
            </div>

            {/* Service List */}
            <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Dịch vụ đã đăng ký ({booking.service_names.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {booking.service_names.map((sName, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-2xs"
                  >
                    ✨ {sName}
                  </span>
                ))}
              </div>
            </div>

            {/* QR Code and Check-in pass */}
            <div className="border-t border-dashed border-slate-200 pt-4 flex items-center justify-between">
              <div className="space-y-1 max-w-[260px]">
                <span className="text-xs font-bold text-slate-800 block">
                  Mã QR Check-in Tại Quầy
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Vui lòng xuất trình mã này cho nhân viên lễ tân khi đưa bé đến phòng khám.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-teal-600 font-semibold pt-1">
                  <ShieldCheck size={12} />
                  <span>Xác thực tự động không cần xếp hàng</span>
                </div>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <QRCode
                  value={`PETCARE-CHECKIN:${booking.booking_code}`}
                  size={76}
                  level="M"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Printer size={15} />
              <span>In / Lưu Phiếu</span>
            </button>

            <button
              type="button"
              onClick={onNewBooking}
              className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle size={15} />
              <span>Đặt Thêm Lịch</span>
            </button>

            <button
              type="button"
              onClick={onSwitchToChat}
              className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <MessageSquare size={15} />
              <span>Chat Với AI</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
