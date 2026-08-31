'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BookingFormData, AVAILABLE_SERVICES } from '../../types/booking';
import { usePriceEstimate } from '../../hooks/usePriceEstimate';
import {
  Receipt,
  Gift,
  AlertTriangle,
  Calendar,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LivePriceSummaryCardProps {
  isSubmitting?: boolean;
}

export function LivePriceSummaryCard({ isSubmitting = false }: LivePriceSummaryCardProps) {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<BookingFormData>();

  const services = watch('services') || [];
  const weightKg = watch('weight_kg') || 5;
  const durationDays = watch('duration_days') || 1;
  const petName = watch('pet_name');
  const petType = watch('pet_type');
  const customerName = watch('customer_name');
  const bookingDate = watch('booking_date');
  const bookingTime = watch('booking_time');

  const { estimate, isLoading: isEstimateLoading } = usePriceEstimate(
    services,
    weightKg,
    durationDays
  );

  const petTypeLabel =
    petType === 'dog' ? 'Cún' : petType === 'cat' ? 'Mèo' : petType === 'other' ? 'Thú cưng' : '';

  const isOnlyMedical =
    services.length === 1 && services[0] === 'medical';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden sticky top-6">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 text-white p-4.5 sm:p-5 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 backdrop-blur-xs rounded-xl text-white">
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Phiếu Dịch Vụ Tạm Tính</h3>
              <p className="text-[11px] text-teal-100 font-medium">Cập nhật chi phí thời gian thực</p>
            </div>
          </div>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            {services.length} dịch vụ
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4 text-xs">
        {/* Customer & Pet Snapshot Mini Card */}
        <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-semibold text-slate-500">Khách & Bé:</span>
            <span className="font-bold text-slate-800">
              {customerName ? customerName : 'Chưa nhập tên'}{' '}
              {petName ? `• ${petName}` : ''}{' '}
              {petTypeLabel ? `(${petTypeLabel}, ${weightKg}kg)` : `(${weightKg}kg)`}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="font-semibold text-slate-500">Lịch hẹn:</span>
            <span className="font-bold text-teal-700 flex items-center gap-1">
              <Calendar size={12} className="text-teal-600" />
              {bookingDate ? bookingDate : '--/--/----'}{' '}
              <Clock size={12} className="text-teal-600 ml-1" />
              {bookingTime ? bookingTime : '--:--'}
            </span>
          </div>
        </div>

        {/* Selected Services List */}
        <div>
          <div className="flex items-center justify-between font-bold text-slate-700 mb-2">
            <span>Chi tiết các mục đã chọn:</span>
            {isEstimateLoading && (
              <span className="text-[10px] text-teal-600 font-normal flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> Đang tính...
              </span>
            )}
          </div>

          {(!estimate?.items || estimate.items.length === 0) ? (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
              <Sparkles size={20} className="mx-auto mb-1 text-slate-300" />
              Chưa chọn dịch vụ nào. Hãy tick chọn các dịch vụ ở cột bên trái!
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(estimate.items || []).map((item, idx) => {
                const serviceDef = AVAILABLE_SERVICES.find(
                  (s) => s.id === item.service_id
                );
                const displayName =
                  item.service_name && item.service_name !== item.service_id
                    ? item.service_name
                    : serviceDef?.name || item.service_name || item.service_id;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex-1 pr-2">
                      <span className="font-semibold text-slate-800">{displayName}</span>
                      {item.note && (
                        <p className="text-[10px] text-slate-400 leading-tight">{item.note}</p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      {item.is_quote_only ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Bác sĩ báo giá sau
                        </span>
                      ) : (
                        <span className="font-bold text-slate-800">
                          {(Number(item.total_price) || 0).toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Boarding Gift / Bonus Badges */}
        {Array.isArray(estimate?.free_gifts) && estimate.free_gifts.length > 0 && (
          <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 mb-1">
              <Gift size={14} className="text-emerald-600" />
              <span>Quà tặng & Ưu đãi áp dụng:</span>
            </div>
            {estimate.free_gifts.map((gift, gIdx) => (
              <p key={gIdx} className="text-[11px] text-emerald-700 font-medium pl-4">
                • {gift}
              </p>
            ))}
          </div>
        )}

        {/* Pricing Calculation Summary */}
        <div className="pt-3 border-t border-dashed border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between text-slate-600">
            <span>Tạm tính niêm yết:</span>
            <span className="font-semibold text-slate-800">
              {(Number(estimate?.subtotal) || 0).toLocaleString('vi-VN')}đ
            </span>
          </div>

          {(Number(estimate?.discount_amount) || 0) > 0 && (
            <div className="flex items-center justify-between text-emerald-600">
              <span>Giảm giá ({Number(estimate?.discount_percentage) || 0}%):</span>
              <span className="font-bold">
                -{(Number(estimate?.discount_amount) || 0).toLocaleString('vi-VN')}đ
              </span>
            </div>
          )}

          {/* Grand Total */}
          <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
            <span className="font-extrabold text-slate-900 text-sm">TỔNG TIỀN DỰ KIẾN:</span>
            <div className="text-right">
              {isOnlyMedical ? (
                <span className="font-extrabold text-emerald-700 text-base">
                  Báo giá sau khám
                </span>
              ) : (
                <span className="font-black text-teal-600 text-xl tracking-tight">
                  {(Number(estimate?.final_total) || 0).toLocaleString('vi-VN')}
                  <span className="text-xs font-bold text-teal-700 ml-0.5">đ</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        {estimate.disclaimer && (
          <div className="p-2.5 bg-amber-50/80 border border-amber-200/70 rounded-2xl text-[10.5px] text-amber-800 leading-relaxed flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{estimate.disclaimer}</span>
          </div>
        )}

        {/* Notes Textarea (Optional) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <FileText size={12} className="text-slate-400" />
            Ghi chú thêm cho Bác sĩ / Kỹ thuật viên:
          </label>
          <textarea
            rows={2}
            placeholder="VD: Bé hơi nhát người lạ, cần cắt móng nhẹ tay, bé bị dị ứng hải sản..."
            {...register('notes')}
            className="w-full p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Primary CTA Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || services.length === 0}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-500 hover:from-teal-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/35 active:scale-98 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Đang xử lý đơn đặt lịch...</span>
            </>
          ) : (
            <>
              <CheckCircle size={18} />
              <span>XÁC NHẬN ĐẶT LỊCH HẸN</span>
            </>
          )}
        </button>

        {/* Security & Guarantee Trust Badge */}
        <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 pt-1">
          <ShieldCheck size={12} className="text-teal-600" />
          <span>Cam kết không phát sinh phụ phí ngoài thỏa thuận</span>
        </div>
      </div>
    </div>
  );
}
