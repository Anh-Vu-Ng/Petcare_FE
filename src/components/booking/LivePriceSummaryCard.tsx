'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BookingFormData } from '../../types/booking';
import { usePriceEstimate } from '../../hooks/usePriceEstimate';
import { EASE_OUT, FAST_EXIT } from '../../utils/motion';
import {
  Receipt,
  Gift,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface LivePriceSummaryCardProps {
  isSubmitting?: boolean;
}

export function LivePriceSummaryCard({ isSubmitting = false }: LivePriceSummaryCardProps) {
  const { watch, register } = useFormContext<BookingFormData>();
  const reduce = useReducedMotion();

  const services = watch('services') || [];
  const weightKg = watch('weight_kg') || 5;
  const durationDays = watch('duration_days') || 1;
  const petName = watch('pet_name');
  const petType = watch('pet_type');
  const customerName = watch('customer_name');
  const bookingDate = watch('booking_date');
  const bookingTime = watch('booking_time');

  const { estimate } = usePriceEstimate(services, weightKg, durationDays);

  const petTypeLabel =
    petType === 'dog' ? 'Cún' : petType === 'cat' ? 'Mèo' : petType === 'other' ? 'Thú cưng' : '';

  const isOnlyMedical = services.length === 1 && services[0] === 'medical';
  const totalValue = Number(estimate?.final_total) || 0;

  return (
    <aside className="w-full bg-surface-card rounded-[14px] border border-clay overflow-hidden shadow-[var(--shadow-ledger)]">
      {/* Glazed-Slate Ticket Header */}
      <div className="bg-shell-bg text-shell-ink-bright px-5 py-4 border-b border-shell-header-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-shell-surface border border-shell-border rounded-[8px] text-shell-ink-bright">
              <Receipt size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Phiếu Dịch Vụ Tạm Tính</h2>
              <p className="text-xs text-shell-muted mt-0.5">Cập nhật tự động theo cân nặng</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[7px] text-xs font-mono tabular-nums font-semibold bg-shell-surface text-shell-ink-bright border border-shell-border">
            <span className="inline-block [perspective:400px] overflow-hidden align-bottom">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={services.length}
                  className="inline-block"
                  initial={{ rotateX: reduce ? 0 : -90, opacity: 0, y: reduce ? 0 : '40%' }}
                  animate={{ rotateX: 0, opacity: 1, y: 0 }}
                  exit={{ rotateX: reduce ? 0 : 90, opacity: 0, y: reduce ? 0 : '-40%' }}
                  transition={{ duration: reduce ? 0.16 : 0.28, ease: EASE_OUT }}
                >
                  {services.length}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>dịch vụ</span>
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4 text-sm">
        {/* Snapshot */}
        <div className="bg-surface-subtle/80 rounded-[10px] p-3 border border-rim space-y-1.5 text-xs sm:text-[13px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-ink-secondary">Khách &amp; Bé:</span>
            <span className="font-semibold text-ink-primary text-right">
              {customerName ? customerName : 'Chưa nhập tên'}{' '}
              {petName ? `· ${petName}` : ''}{' '}
              <span className="font-mono tabular-nums text-ink-slate">
                ({petTypeLabel ? `${petTypeLabel}, ` : ''}{weightKg}kg)
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-ink-secondary">Lịch hẹn:</span>
            <span className="font-mono tabular-nums font-semibold text-ink-slate flex items-center gap-1.5">
              <Calendar size={12} className="text-ink-muted" />
              <span>{bookingDate ? bookingDate : '--/--/----'}</span>
              <Clock size={12} className="text-ink-muted ml-1" />
              <span>{bookingTime ? bookingTime : '--:--'}</span>
            </span>
          </div>
        </div>

        {/* Itemized Price Ledger */}
        {Array.isArray(estimate?.items) && estimate.items.length > 0 ? (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-ink-secondary block">
              Chi tiết dịch vụ tạm tính
            </span>
            <div className="divide-y divide-divider bg-surface-pure rounded-[9px] border border-rim px-3 overflow-hidden">
              <AnimatePresence initial={false}>
                {estimate.items.map((item) => (
                  <motion.div
                    key={item.service_id}
                    layout={!reduce}
                    initial={{ opacity: 0, y: reduce ? 0 : -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: reduce ? 0 : 16, transition: FAST_EXIT }}
                    transition={{ duration: 0.22, ease: EASE_OUT }}
                    className="py-2.5 flex items-start justify-between gap-3 text-xs sm:text-[13px]"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-ink-primary block leading-snug">
                        {item.service_name}
                      </span>
                      {item.note && (
                        <span className="text-[11px] text-ink-muted block mt-0.5">{item.note}</span>
                      )}
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-ink-slate flex-shrink-0 text-right">
                      {item.is_quote_only ? (
                        <span className="font-sans text-state-success-ink">Báo giá sau</span>
                      ) : (
                        `${(Number(item.total_price) || 0).toLocaleString('vi-VN')}đ`
                      )}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-[9px] bg-surface-subtle/60 border border-rim text-xs text-ink-secondary text-center">
            Chưa chọn dịch vụ nào. Vui lòng chọn ít nhất 1 dịch vụ bên trái.
          </div>
        )}

        {/* Free Gifts */}
        <AnimatePresence initial={false}>
          {Array.isArray(estimate?.free_gifts) && estimate.free_gifts.length > 0 && (
            <motion.div
              key="free-gifts"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-state-success-soft border border-state-success-border rounded-[10px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-state-success-ink mb-1">
                  <Gift size={14} />
                  <span>Quà tặng &amp; Ưu đãi áp dụng</span>
                </div>
                {estimate.free_gifts.map((gift, gIdx) => (
                  <p key={gIdx} className="text-xs text-state-success-ink font-medium pl-4">
                    • {gift}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Totals */}
        <div className="pt-3 border-t border-dashed border-strong space-y-2">
          <AnimatePresence initial={false}>
            {(Number(estimate?.discount_amount) || 0) > 0 && (
              <motion.div
                key="discount-row"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm text-state-success-ink font-medium pb-1">
                  <span>Ưu đãi lưu trú ({Number(estimate?.discount_percentage) || 0}%):</span>
                  <span className="font-mono tabular-nums font-bold">
                    -{(Number(estimate?.discount_amount) || 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-baseline justify-between pt-0.5">
            <span className="font-bold text-ink-primary text-sm uppercase tracking-wide">
              Tổng tiền dự kiến
            </span>
            <div className="text-right">
              {isOnlyMedical ? (
                <span className="font-bold text-state-success-ink text-base">
                  Bác sĩ báo giá sau khám
                </span>
              ) : (
                <span className="font-mono tabular-nums font-bold text-accent-collar-ink text-2xl tracking-tight">
                  <span className="inline-block [perspective:400px] overflow-hidden align-bottom">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={totalValue}
                        className="inline-block"
                        initial={{ rotateX: reduce ? 0 : -90, opacity: 0, y: reduce ? 0 : '40%' }}
                        animate={{ rotateX: 0, opacity: 1, y: 0 }}
                        exit={{ rotateX: reduce ? 0 : 90, opacity: 0, y: reduce ? 0 : '-40%' }}
                        transition={{ duration: reduce ? 0.16 : 0.28, ease: EASE_OUT }}
                      >
                        {totalValue.toLocaleString('vi-VN')}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-sm font-bold ml-0.5">đ</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        {estimate.disclaimer && (
          <div className="p-3 bg-state-warning-soft border border-state-warning-border rounded-[10px] text-xs text-state-warning-ink leading-relaxed flex items-start gap-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{estimate.disclaimer}</span>
          </div>
        )}

        {/* Notes */}
        <div>
          <label
            htmlFor="booking_notes"
            className="text-xs font-semibold text-ink-primary mb-1.5 flex items-center gap-1.5"
          >
            <FileText size={13} className="text-ink-secondary" />
            <span>Ghi chú thêm cho Bác sĩ / Kỹ thuật viên</span>
          </label>
          <textarea
            id="booking_notes"
            rows={2}
            placeholder="VD: Bé hơi nhát người lạ, cần cắt móng nhẹ tay, bé bị dị ứng hải sản..."
            {...register('notes')}
            className="w-full p-2.5 bg-surface-pure border border-clay rounded-[10px] text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-control-active-border focus:ring-2 focus:ring-focus-ring/20 transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileTap={reduce ? undefined : { scale: 0.98 }}
          disabled={isSubmitting || services.length === 0}
          className="w-full py-3 px-4 rounded-[10px] bg-accent-collar hover:bg-accent-collar-hover text-white font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              <span>Đang xử lý đơn đặt lịch...</span>
            </>
          ) : (
            <>
              <CheckCircle size={17} />
              <span>Xác nhận đặt lịch hẹn</span>
            </>
          )}
        </motion.button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-ink-secondary pt-0.5">
          <ShieldCheck size={14} className="text-state-success-ink flex-shrink-0" />
          <span>Cam kết không phát sinh phụ phí ngoài thỏa thuận</span>
        </div>
      </div>
    </aside>
  );
}
