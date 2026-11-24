'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BookingFormData, AVAILABLE_SERVICES, ServiceDefinition } from '../../types/booking';
import {
  Bath,
  Scissors,
  Sparkles,
  Ear,
  ShieldCheck,
  Stethoscope,
  Hotel,
  Check,
  Plus,
  Minus,
  Gift,
  Percent,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE_OUT, FAST_EXIT } from '../../utils/motion';

function getServiceIcon(iconName: string, size = 16) {
  switch (iconName) {
    case 'Bath':
      return <Bath size={size} />;
    case 'Scissors':
      return <Scissors size={size} />;
    case 'Sparkles':
      return <Sparkles size={size} />;
    case 'Ear':
      return <Ear size={size} />;
    case 'Flame':
      return <ShieldCheck size={size} />;
    case 'Stethoscope':
      return <Stethoscope size={size} />;
    case 'Hotel':
      return <Hotel size={size} />;
    default:
      return <Sparkles size={size} />;
  }
}

function getCategoryStyle(category: ServiceDefinition['category']) {
  switch (category) {
    case 'medical':
      return {
        dot: 'bg-corridor-medical',
        label: 'Khám bệnh',
        badge: 'bg-state-success-soft text-state-success-ink border-state-success-border',
      };
    case 'hotel':
      return {
        dot: 'bg-corridor-hotel',
        label: 'Lưu trú',
        badge: 'bg-slate-soft text-slate-soft-ink border-slate-soft-border',
      };
    default:
      return {
        dot: 'bg-corridor-spa',
        label: 'Spa',
        badge: 'bg-accent-collar-soft text-accent-collar-soft-ink border-accent-collar-soft-border',
      };
  }
}

export function ServiceSelectorGrid() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BookingFormData>();
  const reduce = useReducedMotion();

  const selectedServices = watch('services') || [];
  const weightKg = watch('weight_kg') || 5;
  const durationDays = watch('duration_days') || 1;

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
    <section className="bg-surface-card rounded-[14px] p-5 sm:p-6 border border-rim">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3.5 border-b border-rim">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-shell-bg text-shell-ink-bright flex items-center justify-center font-mono tabular-nums font-bold text-xs flex-shrink-0">
            02
          </div>
          <div>
            <h2 className="font-bold text-ink-primary text-base sm:text-lg leading-tight">
              Lựa chọn Dịch vụ Chăm sóc &amp; Khám
              <span className="ml-2 text-xs font-mono tabular-nums font-semibold text-ink-secondary">
                ({selectedServices.length} đã chọn)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
              Có thể kết hợp nhiều dịch vụ trong cùng một lịch hẹn
            </p>
          </div>
        </div>

        {/* Semantic Corridor Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-ink-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-corridor-spa" aria-hidden="true" /> Spa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-corridor-medical" aria-hidden="true" /> Khám bệnh
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-corridor-hotel" aria-hidden="true" /> Lưu trú
          </span>
        </div>
      </div>

      {errors.services && (
        <div className="mb-4 p-3 bg-state-error-soft border border-state-error-border rounded-[10px] text-xs text-state-error-ink font-medium flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{errors.services.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {AVAILABLE_SERVICES.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          const catStyle = getCategoryStyle(service.category);

          let displayPrice = service.basePrice;
          if (service.weightTierFactor) {
            displayPrice = Math.round((service.basePrice * weightFactor) / 1000) * 1000;
          }

          return (
            <motion.button
              key={service.id}
              type="button"
              whileTap={reduce ? undefined : { scale: 0.98 }}
              onClick={() => toggleService(service.id)}
              aria-pressed={isSelected}
              className={`text-left p-4 rounded-[11px] border transition-colors cursor-pointer select-none flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                isSelected
                  ? 'bg-surface-pure border-control-active-border ring-1 ring-control-active-border'
                  : 'bg-surface-pure border-rim hover:border-control-active-border/60 hover:bg-surface-card'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-[6px] flex items-center justify-center border flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-control-active-bg border-control-active-border text-control-active-ink'
                          : 'border-strong bg-surface-card group-hover:border-control-active-border'
                      }`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            key="check"
                            initial={reduce ? { opacity: 0 } : { scale: 0, rotate: -45 }}
                            animate={reduce ? { opacity: 1 } : { scale: 1, rotate: 0 }}
                            exit={reduce ? { opacity: 0, transition: FAST_EXIT } : { scale: 0, transition: FAST_EXIT }}
                            transition={{ duration: reduce ? 0.14 : 0.22, ease: EASE_OUT }}
                            className="inline-flex items-center justify-center"
                          >
                            <Check size={12} strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>

                    <span
                      className={`p-1.5 rounded-[8px] flex-shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-control-active-bg text-control-active-ink border-control-active-border'
                          : 'bg-surface-subtle text-ink-primary border-rim'
                      }`}
                    >
                      {getServiceIcon(service.iconName, 15)}
                    </span>

                    <span className="text-sm font-bold leading-snug text-ink-primary">
                      {service.name}
                    </span>
                  </div>

                  <span
                    className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 mt-1 ${catStyle.dot}`}
                    title={catStyle.label}
                  />
                </div>

                <p className="text-xs sm:text-[13px] text-ink-secondary leading-relaxed line-clamp-2 pl-7.5 mb-3">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-divider text-xs pl-7.5">
                {service.isQuoteOnly ? (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-semibold border ${catStyle.badge}`}>
                    <Stethoscope size={12} />
                    <span>{service.badge}</span>
                  </span>
                ) : service.isDurationBased ? (
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="font-mono tabular-nums font-bold text-ink-slate text-sm">
                      {displayPrice.toLocaleString('vi-VN')}đ
                      <span className="text-[11px] font-sans font-normal text-ink-muted">/ngày</span>
                    </span>
                    {service.badge && (
                      <span className="text-[10.5px] font-semibold text-state-warning-ink bg-state-warning-soft px-2 py-0.5 rounded-[6px] border border-state-warning-border">
                        {service.badge}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="font-mono tabular-nums font-bold text-ink-slate text-sm">
                      {displayPrice.toLocaleString('vi-VN')}đ
                    </span>
                    {service.weightTierFactor && (
                      <span className="text-[11px] font-mono tabular-nums text-ink-muted">
                        mức {weightKg} kg
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Boarding Duration Controls */}
      <AnimatePresence>
        {isBoardingSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-state-warning-soft rounded-[12px] p-4 border border-state-warning-border mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-shell-bg text-shell-ink-bright rounded-[8px]">
                    <Hotel size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink-primary">
                      Thời gian lưu trú (Khách sạn 24h)
                    </h3>
                    <p className="text-xs text-ink-secondary">
                      Gửi bé dài ngày nhận ưu đãi đến 15% và quà tặng Tắm Spa
                    </p>
                  </div>
                </div>

                <div className="flex items-center self-start sm:self-auto gap-2 bg-surface-pure px-3 py-1.5 rounded-[9px] border border-state-warning-border">
                  <span className="text-xs text-ink-secondary font-medium mr-1">Số ngày:</span>
                  <button
                    type="button"
                    onClick={() => handleDurationChange(-1)}
                    disabled={durationDays <= 1}
                    aria-label="Giảm số ngày lưu trú"
                    className="w-7 h-7 rounded-[6px] bg-surface-subtle hover:bg-surface-hover text-ink-primary flex items-center justify-center disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center text-sm font-mono tabular-nums font-bold text-ink-slate">
                    {durationDays}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDurationChange(1)}
                    disabled={durationDays >= 30}
                    aria-label="Tăng số ngày lưu trú"
                    className="w-7 h-7 rounded-[6px] bg-accent-collar hover:bg-accent-collar-hover text-white flex items-center justify-center disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div className="bg-surface-pure rounded-[10px] p-3 border border-state-warning-border">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-ink-secondary flex items-center gap-1.5">
                    <Percent size={13} className="text-accent-collar-ink" />
                    <span>Mốc ưu đãi lưu trú</span>
                  </span>
                  <span className="text-state-warning-ink font-bold">
                    {boardingDiscount > 0
                      ? `Đang áp dụng giảm ${boardingDiscount}%`
                      : 'Từ 4 ngày để giảm 5%'}
                  </span>
                </div>

                <div className="w-full h-2 bg-surface-subtle rounded-full overflow-hidden mb-2.5">
                  <div
                    className="h-full bg-accent-collar transition-all duration-300"
                    style={{ width: `${Math.min(100, (durationDays / 12) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-center font-mono tabular-nums">
                  <div
                    className={`p-1.5 rounded-[7px] border ${
                      durationDays >= 4
                        ? 'bg-state-warning-soft text-state-warning-ink border-state-warning-border font-bold'
                        : 'bg-surface-card text-ink-muted border-divider'
                    }`}
                  >
                    4–5 ngày: -5%
                  </div>
                  <div
                    className={`p-1.5 rounded-[7px] border ${
                      durationDays >= 6
                        ? 'bg-state-warning-soft text-state-warning-ink border-state-warning-border font-bold'
                        : 'bg-surface-card text-ink-muted border-divider'
                    }`}
                  >
                    6–10 ngày: -10%
                  </div>
                  <div
                    className={`p-1.5 rounded-[7px] border ${
                      durationDays >= 11
                        ? 'bg-accent-collar-soft text-accent-collar-soft-ink border-accent-collar-soft-border font-bold'
                        : 'bg-surface-card text-ink-muted border-divider'
                    }`}
                  >
                    &ge;11 ngày: -15% + Spa
                  </div>
                </div>

                {hasFreeBathGift && (
                  <div className="mt-2.5 text-xs text-state-success-ink bg-state-success-soft border border-state-success-border rounded-[8px] px-3 py-2 flex items-center gap-2 font-semibold">
                    <Gift size={15} className="text-state-success-ink flex-shrink-0" />
                    <span>Bé được tặng kèm 1 suất Tắm Spa &amp; Chăm sóc lông miễn phí</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
