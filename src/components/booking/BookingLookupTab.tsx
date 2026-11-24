'use client';

import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { bookingApi } from '../../services/bookingApi';
import { AVAILABLE_SERVICES, BookingDetail, BookingStatus } from '../../types/booking';
import {
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Copy,
  Loader2,
  XCircle,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { collarFlip, fadeSwap, EASE_OUT, FAST_EXIT } from '../../utils/motion';

function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case 'CONFIRMED':
      return {
        label: 'Đã Xác Nhận',
        className: 'bg-state-success text-white border-state-success-border-solid',
        icon: <CheckCircle2 size={13} />,
      };
    case 'COMPLETED':
      return {
        label: 'Hoàn Tất',
        className: 'bg-shell-border text-shell-ink-bright border-shell-border',
        icon: <CheckCircle2 size={13} />,
      };
    case 'CANCELLED':
      return {
        label: 'Đã Hủy',
        className: 'bg-state-error text-white border-state-error-border-solid',
        icon: <XCircle size={13} />,
      };
    default:
      return {
        label: 'Chờ Duyệt',
        className: 'bg-state-warning text-white border-state-warning-border-solid',
        icon: <Clock3 size={13} />,
      };
  }
}

export function BookingLookupTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<BookingDetail[]>([]);
  const reduce = useReducedMotion();

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
    if (status === 'CANCELLED') {
      return (
        <div className="py-3 px-4 bg-state-error-soft rounded-[10px] border border-state-error-border mb-4 flex items-center gap-2.5 text-xs text-state-error-ink font-semibold">
          <XCircle size={16} className="flex-shrink-0" />
          <span>Lịch hẹn này đã bị hủy. Bạn có thể đặt lại khung giờ mới bất kỳ lúc nào.</span>
        </div>
      );
    }

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
    const fillPercent = currentIndex === 0 ? '0%' : currentIndex === 1 ? '50%' : '100%';

    return (
      <div className="py-3.5 px-4 bg-surface-subtle/70 rounded-[11px] border border-rim mb-4">
        <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block mb-3">
          Tiến trình xử lý đơn
        </span>

        <div className="flex items-start justify-between relative">
          {/* Station Rail */}
          <div className="absolute top-4 left-12 right-12 h-0.5 bg-rim" aria-hidden="true">
            <div
              className="h-full bg-state-success transition-all duration-300"
              style={{ width: fillPercent }}
            />
          </div>

          {steps.map((step, idx) => {
            const isPassed = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24, ease: EASE_OUT, delay: reduce ? 0 : idx * 0.06 }}
                className="flex flex-col items-center text-center z-10 w-28 sm:w-32"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono tabular-nums font-bold transition-colors border ${
                    isCurrent
                      ? 'bg-state-success text-white border-state-success ring-4 ring-state-success/15'
                      : isPassed
                      ? 'bg-state-success text-white border-state-success'
                      : 'bg-surface-pure text-ink-muted border-strong'
                  }`}
                >
                  {isPassed ? <CheckCircle2 size={15} /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-bold mt-2 leading-tight ${
                    isCurrent ? 'text-state-success-ink' : isPassed ? 'text-ink-primary' : 'text-ink-muted'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[11px] text-ink-secondary mt-0.5 leading-tight">
                  {step.desc}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Card */}
      <section className="bg-surface-card rounded-[14px] p-5 sm:p-6 border border-rim">
        <div className="max-w-xl mx-auto text-center mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-ink-slate tracking-[-0.02em] mb-1.5">
            Tra Cứu Lịch Hẹn Chăm Sóc
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            Nhập Mã đặt chỗ (<span className="font-mono text-ink-slate font-semibold">BK-YYYYMMDD-XXXX</span>) hoặc Số điện thoại để kiểm tra trạng thái phiếu dịch vụ
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
              <Search size={17} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="VD: BK-20260828-A8F2 hoặc 0987654321..."
              aria-label="Mã đặt chỗ hoặc số điện thoại"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-pure border border-clay rounded-[10px] text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-control-active-border focus:ring-2 focus:ring-focus-ring/20 transition-colors font-medium"
            />
          </div>

          <motion.button
            type="submit"
            whileTap={reduce ? undefined : { scale: 0.98 }}
            disabled={isLoading}
            className="py-2.5 px-6 rounded-[10px] bg-accent-collar hover:bg-accent-collar-hover text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            <span>Tra cứu</span>
          </motion.button>
        </form>
      </section>

      {/* Results */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4, transition: FAST_EXIT }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="bg-surface-card rounded-[14px] p-12 text-center border border-rim"
          >
            <Loader2 size={28} className="animate-spin text-ink-slate mx-auto mb-2.5" />
            <p className="text-sm font-semibold text-ink-secondary">Đang tìm kiếm thông tin đơn hẹn...</p>
          </motion.div>
        ) : hasSearched && results.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4, transition: FAST_EXIT }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="bg-surface-card rounded-[14px] p-10 text-center border border-rim"
          >
            <div className="w-12 h-12 bg-state-warning-soft rounded-[10px] text-state-warning-ink flex items-center justify-center mx-auto mb-3 border border-state-warning-border">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-base font-bold text-ink-primary mb-1">
              Không tìm thấy lịch hẹn phù hợp
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-md mx-auto leading-relaxed">
              Vui lòng kiểm tra lại Mã đặt chỗ (<span className="font-mono">BK-...</span>) hoặc Số điện thoại bạn đã đăng ký.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4, transition: FAST_EXIT }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            style={reduce ? undefined : { perspective: 1200 }}
            className="space-y-4"
          >
            {results.map((booking, idx) => {
              const badge = getStatusBadge(booking.status);
              const flipVariants = reduce
                ? fadeSwap
                : {
                    ...collarFlip,
                    visible: {
                      opacity: 1,
                      rotateY: 0,
                      transition: { duration: 0.55, ease: EASE_OUT, delay: Math.min(idx, 4) * 0.08 },
                    },
                  };
              return (
                <motion.article
                  key={booking.booking_code}
                  variants={flipVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={reduce ? undefined : { transformOrigin: 'left center' }}
                  className="bg-surface-card rounded-[14px] border border-clay overflow-hidden"
                >
                {/* Engraved Header */}
                <div className="bg-shell-bg text-shell-ink-bright px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-shell-header-border">
                  <div>
                    <span className="text-[11px] uppercase font-semibold text-shell-muted tracking-wider block">
                      Mã phiếu đặt hẹn
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-lg sm:text-xl font-mono tabular-nums font-bold text-white">
                        {booking.booking_code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(booking.booking_code)}
                        aria-label={`Sao chép mã ${booking.booking_code}`}
                        className="p-1.5 rounded-[7px] bg-shell-surface hover:bg-shell-hover border border-shell-border text-shell-tab-idle transition-colors cursor-pointer"
                        title="Sao chép mã"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-[7px] text-xs font-semibold border flex items-center gap-1.5 ${badge.className}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {renderStatusTimeline(booking.status)}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-surface-pure rounded-[10px] border border-rim">
                      <span className="text-ink-muted block text-[11px] mb-0.5">Khách hàng &amp; SĐT</span>
                      <span className="font-bold text-ink-primary block text-sm">
                        {booking.customer_name}
                      </span>
                      <span className="font-mono tabular-nums text-ink-slate font-semibold block mt-0.5">
                        {booking.customer_phone}
                      </span>
                    </div>

                    <div className="p-3.5 bg-surface-pure rounded-[10px] border border-rim">
                      <span className="text-ink-muted block text-[11px] mb-0.5">Thông tin Bé cưng</span>
                      <span className="font-bold text-ink-primary block text-sm">
                        {booking.pet_name || 'Bé cưng'}
                      </span>
                      <span className="text-ink-secondary block mt-0.5">
                        Cân nặng:{' '}
                        <strong className="font-mono tabular-nums text-ink-slate">
                          {booking.weight_kg} kg
                        </strong>
                      </span>
                    </div>

                    <div className="p-3.5 bg-surface-pure rounded-[10px] border border-rim">
                      <span className="text-ink-muted block text-[11px] mb-0.5">Lịch hẹn</span>
                      <span className="font-mono tabular-nums font-bold text-ink-slate text-sm flex items-center gap-1.5">
                        <Calendar size={13} className="text-ink-muted" />
                        <span>{booking.booking_date}</span>
                      </span>
                      <span className="font-mono tabular-nums font-bold text-ink-primary mt-0.5 flex items-center gap-1.5">
                        <Clock size={13} className="text-accent-collar-ink" />
                        <span>{booking.booking_time}</span>
                      </span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="p-3.5 bg-surface-pure rounded-[10px] border border-rim">
                    <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block mb-2">
                      Dịch vụ thực hiện
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.service_names.map((sName, idx) => {
                        const matched = AVAILABLE_SERVICES.find(
                          (s) => s.id === booking.services[idx] || s.name === sName
                        );
                        const dotColor =
                          matched?.category === 'medical'
                            ? 'bg-corridor-medical'
                            : matched?.category === 'hotel'
                            ? 'bg-corridor-hotel'
                            : 'bg-corridor-spa';
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] text-xs font-semibold bg-surface-subtle text-ink-primary border border-rim"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
                            <span>{sName}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Bar: QR & Total */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3.5 border-t border-dashed border-strong">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white border border-clay rounded-[9px]">
                        <QRCode value={`PETCARE-CHECKIN:${booking.booking_code}`} size={60} level="M" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-ink-primary block">
                          Mã check-in tự động
                        </span>
                        <span className="text-[11px] text-ink-secondary block">
                          Đưa mã này cho lễ tân khi tới phòng khám
                        </span>
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <span className="text-xs text-ink-secondary block">Chi phí tạm tính</span>
                      {booking.has_quote_only_service &&
                      ((booking.services.length === 1 && booking.services[0] === 'medical') ||
                        booking.estimated_price <= 0) ? (
                        <span className="font-bold text-state-success-ink text-sm">
                          Bác sĩ báo giá sau
                        </span>
                      ) : (
                        <>
                          <span className="font-mono tabular-nums text-lg font-bold text-accent-collar-ink">
                            {booking.estimated_price.toLocaleString('vi-VN')}đ
                          </span>
                          {booking.has_quote_only_service && (
                            <span className="text-[11px] text-state-success-ink font-medium block mt-0.5">
                              + Khám bệnh báo giá sau
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
