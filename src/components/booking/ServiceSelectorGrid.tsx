'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BookingFormData, AVAILABLE_SERVICES, ServiceDefinition, ServiceId } from '../../types/booking';
import {
  Bath,
  Scissors,
  Sparkles,
  Stethoscope,
  Hotel,
  Check,
  Plus,
  Minus,
  Gift,
  HelpCircle,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper icon resolver
function getServiceIcon(iconName: string, size = 20, className = '') {
  switch (iconName) {
    case 'Bath':
      return <Bath size={size} className={className} />;
    case 'Scissors':
      return <Scissors size={size} className={className} />;
    case 'Sparkles':
      return <Sparkles size={size} className={className} />;
    case 'Stethoscope':
      return <Stethoscope size={size} className={className} />;
    case 'Hotel':
      return <Hotel size={size} className={className} />;
    default:
      return <Sparkles size={size} className={className} />;
  }
}

export function ServiceSelectorGrid() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BookingFormData>();

  const selectedServices = watch('services') || [];
  const weightKg = watch('weight_kg') || 5;
  const durationDays = watch('duration_days') || 1;

  // Weight tier multiplier for price preview
  let weightFactor = 1.0;
  if (weightKg >= 20) weightFactor = 1.8;
  else if (weightKg >= 10) weightFactor = 1.5;
  else if (weightKg >= 5) weightFactor = 1.2;

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setValue(
        'services',
        selectedServices.filter((id) => id !== serviceId),
        { shouldValidate: true }
      );
    } else {
      setValue('services', [...selectedServices, serviceId], { shouldValidate: true });
    }
  };

  const handleDurationChange = (delta: number) => {
    const next = Math.max(1, Math.min(30, durationDays + delta));
    setValue('duration_days', next, { shouldValidate: true });
  };

  const isBoardingSelected = selectedServices.includes('boarding');

  // Calculate boarding discount milestone
  let boardingDiscount = 0;
  let hasFreeBathGift = false;
  if (durationDays >= 11) {
    boardingDiscount = 15;
    hasFreeBathGift = true;
  } else if (durationDays >= 6) {
    boardingDiscount = 10;
  } else if (durationDays >= 4) {
    boardingDiscount = 5;
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm border border-teal-100/80 shadow-xs">
            2
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-1.5">
              Lựa chọn Dịch vụ Chăm sóc & Khám
              <span className="text-xs font-normal text-slate-400">
                (Đã chọn {selectedServices.length} dịch vụ)
              </span>
            </h3>
            <p className="text-sm text-slate-400">
              Có thể chọn đồng thời nhiều dịch vụ để kết hợp thực hiện trong 1 buổi hẹn
            </p>
          </div>
        </div>
      </div>

      {errors.services && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-medium flex items-center gap-2">
          <span>⚠️ {errors.services.message}</span>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {AVAILABLE_SERVICES.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          const isMedical = service.id === 'medical';

          // Estimated display price based on weight
          let displayPrice = service.basePrice;
          if (service.weightTierFactor) {
            displayPrice = Math.round((service.basePrice * weightFactor) / 1000) * 1000;
          }

          return (
            <div
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between group ${
                isSelected
                  ? isMedical
                    ? 'bg-teal-50/50 border-teal-400 ring-2 ring-teal-200 shadow-sm'
                    : 'bg-teal-50/30 border-teal-400 ring-2 ring-teal-200 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-teal-300 hover:bg-slate-50/50'
              }`}
            >
              {/* Top row with Checkbox, Title and Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-teal-500 border-teal-500 text-white'
                          : 'border-slate-300 bg-white group-hover:border-teal-400'
                      }`}
                    >
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>

                    <div
                      className={`p-1.5 rounded-xl transition-colors ${
                        isSelected
                          ? 'bg-teal-500 text-white'
                          : isMedical
                          ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600'
                      }`}
                    >
                      {getServiceIcon(service.iconName, 16)}
                    </div>

                    <span
                      className={`text-sm font-bold leading-tight ${
                        isSelected ? 'text-teal-900' : 'text-slate-700'
                      }`}
                    >
                      {service.name}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 pl-7.5 mb-2.5">
                  {service.description}
                </p>
              </div>

              {/* Bottom row: Price & Tag */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs pl-7.5">
                {service.isQuoteOnly ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    🩺 {service.badge}
                  </span>
                ) : service.isDurationBased ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-teal-700 text-sm">
                      {displayPrice.toLocaleString('vi-VN')}đ
                      <span className="text-[10px] font-normal text-slate-400">/ngày</span>
                    </span>
                    {service.badge && (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        {service.badge}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-teal-700 text-sm">
                      {displayPrice.toLocaleString('vi-VN')}đ
                    </span>
                    {service.weightTierFactor && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        (theo mức {weightKg}kg)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Accordion for Boarding / Hotel Service */}
      <AnimatePresence>
        {isBoardingSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-amber-50/70 rounded-2xl p-4 border border-amber-200/80 mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-amber-500 text-white rounded-xl shadow-xs">
                    <Hotel size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">
                      Tùy chọn thời gian Lưu trú (Khách sạn 24h)
                    </h4>
                    <p className="text-xs text-amber-700">
                      Gửi bé dài ngày để nhận chiết khấu lên đến 15% và quà tặng Spa
                    </p>
                  </div>
                </div>

                {/* Day Counter */}
                <div className="flex items-center self-start sm:self-auto space-x-2 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
                  <span className="text-xs text-slate-600 font-medium mr-1">Số ngày gửi:</span>
                  <button
                    type="button"
                    onClick={() => handleDurationChange(-1)}
                    disabled={durationDays <= 1}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold text-amber-700">
                    {durationDays}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDurationChange(1)}
                    disabled={durationDays >= 30}
                    className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* Gamification Progress Bar */}
              <div className="bg-white/80 rounded-xl p-3 border border-amber-100">
                <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Percent size={12} className="text-amber-500" />
                    Ưu đãi lưu trú:
                  </span>
                  <span className="text-amber-700 font-bold">
                    {boardingDiscount > 0
                      ? `Đã kích hoạt Giảm ${boardingDiscount}%!`
                      : 'Gửi từ 4 ngày để giảm 5%'}
                  </span>
                </div>

                {/* Progress Visual */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (durationDays / 12) * 100)}%` }}
                  />
                </div>

                {/* Milestone Chips */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center">
                  <div
                    className={`p-1 rounded-lg border ${
                      durationDays >= 4
                        ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}
                  >
                    4-5 ngày: -5%
                  </div>
                  <div
                    className={`p-1 rounded-lg border ${
                      durationDays >= 6
                        ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}
                  >
                    6-10 ngày: -10%
                  </div>
                  <div
                    className={`p-1 rounded-lg border ${
                      durationDays >= 11
                        ? 'bg-orange-100 text-orange-900 border-orange-300 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}
                  >
                    &gt;10 ngày: -15% + 🎁 Tắm Spa
                  </div>
                </div>

                {hasFreeBathGift && (
                  <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center gap-1.5 font-semibold">
                    <Gift size={14} className="text-emerald-600 animate-bounce" />
                    <span>Chúc mừng! Bé được TẶNG 1 suất Tắm Spa & Chăm sóc lông miễn phí 🎁</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
