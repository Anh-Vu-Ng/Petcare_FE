'use client';

import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { bookingApi } from '../../services/bookingApi';
import { BookingDetail, BookingStatus } from '../../types/booking';
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Copy,
  Printer,
  Sparkles,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function BookingLookupTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<BookingDetail[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      toast.error('Vui lòng nhập Mã đặt chỗ (BK-...) hoặc Số điện thoại để tra cứu');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      if (query.toUpperCase().startsWith('BK-')) {
        const detail = await bookingApi.getBookingDetail(query);
        setResults(detail ? [detail] : []);
      } else {
        const list = await bookingApi.searchBookingsByPhone(query);
        setResults(list);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.success(`Đã sao chép mã: ${code}`);
    }
  };

  const renderStatusTimeline = (status: BookingStatus) => {
    const steps: { key: BookingStatus; label: string; desc: string }[] = [
      { key: 'PENDING', label: 'Đã Tiếp Nhận', desc: 'Đơn đang chờ xác nhận' },
      { key: 'CONFIRMED', label: 'Đã Duyệt Lịch', desc: 'Phòng khám đã giữ chỗ' },
      { key: 'COMPLETED', label: 'Đã Hoàn Tất', desc: 'Dịch vụ đã hoàn thành' },
    ];

    const getStepIndex = (s: BookingStatus) => {
      switch (s) {
        case 'PENDING':
          return 0;
        case 'CONFIRMED':
          return 1;
        case 'COMPLETED':
          return 2;
        default:
          return 0;
      }
    };

    const currentIndex = getStepIndex(status);

    return (
      <div className="py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
          Tiến Trình Xử Lý Đơn
        </span>

        <div className="flex items-center justify-between relative">
          {/* Timeline background bar */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

          {steps.map((step, idx) => {
            const isPassed = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center z-10 w-28">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isPassed
                      ? 'bg-teal-500 text-white ring-4 ring-teal-100 shadow-sm'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {isPassed ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-bold mt-1.5 leading-tight ${
                    isCurrent ? 'text-teal-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Bar Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md">
        <div className="text-center max-w-lg mx-auto mb-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight mb-1 flex items-center justify-center gap-2">
            Tra Cứu Lịch Hẹn Chăm Sóc
            <Sparkles size={20} className="text-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Nhập Mã đặt chỗ (<span className="font-mono text-teal-600 font-bold">BK-YYYYMMDD-XXXX</span>) hoặc Số điện thoại để kiểm tra trạng thái phiếu dịch vụ
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="VD: BK-20260828-A8F2 hoặc 0987654321..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:bg-white transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="py-3 px-6 rounded-2xl bg-teal-500 hover:bg-teal-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            <span>Tra Cứu</span>
          </button>
        </form>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <Loader2 size={32} className="animate-spin text-teal-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Đang tìm kiếm thông tin đơn hẹn...</p>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-100">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Không tìm thấy lịch hẹn phù hợp
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Vui lòng kiểm tra lại độ chính xác của Mã đặt chỗ hoặc Số điện thoại bạn đã đăng ký.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((booking) => (
            <motion.div
              key={booking.booking_code}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden"
            >
              {/* Card Top Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-4.5 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider block">
                    MÃ PHIẾU ĐẶT HẸN
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg sm:text-xl font-mono font-black text-white">
                      {booking.booking_code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(booking.booking_code)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-teal-200 transition-colors cursor-pointer"
                      title="Sao chép mã"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {booking.status === 'PENDING'
                      ? 'Chờ Duyệt'
                      : booking.status === 'CONFIRMED'
                      ? 'Đã Xác Nhận'
                      : 'Hoàn Tất'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Timeline status stepper */}
                {renderStatusTimeline(booking.status)}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Khách hàng & SĐT</span>
                    <span className="font-bold text-slate-800 block text-sm">
                      {booking.customer_name}
                    </span>
                    <span className="text-teal-600 font-semibold block mt-0.5">
                      {booking.customer_phone}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Thông tin Bé cưng</span>
                    <span className="font-bold text-slate-800 block text-sm">
                      {booking.pet_name || 'Bé cưng'}
                    </span>
                    <span className="text-slate-500 block mt-0.5">
                      Cân nặng: <b className="text-teal-700">{booking.weight_kg} kg</b>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Lịch hẹn</span>
                    <span className="font-bold text-teal-700 block text-sm flex items-center gap-1">
                      <Calendar size={13} />
                      {booking.booking_date}
                    </span>
                    <span className="font-extrabold text-slate-800 block mt-0.5 flex items-center gap-1">
                      <Clock size={13} className="text-amber-500" />
                      {booking.booking_time}
                    </span>
                  </div>
                </div>

                {/* Services */}
                <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Dịch vụ thực hiện
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.service_names.map((sName, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200"
                      >
                        ✨ {sName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar: QR & Total */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-dashed border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <QRCode
                        value={`PETCARE-CHECKIN:${booking.booking_code}`}
                        size={60}
                        level="M"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">
                        Mã check-in tự động
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Đưa mã này khi tới quầy tiếp đón
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Chi phí tạm tính:</span>
                    {booking.has_quote_only_service ? (
                      <span className="font-bold text-emerald-700 text-sm">
                        Bác sĩ báo giá sau
                      </span>
                    ) : (
                      <span className="text-lg font-black text-teal-600">
                        {booking.estimated_price.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
