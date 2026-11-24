'use client';

import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookingFormData, TimeSlot } from '../../types/booking';
import { bookingApi } from '../../services/bookingApi';
import { Calendar as CalendarIcon, Clock, Sun, Sunset, AlertCircle, Loader2 } from 'lucide-react';

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatVietnameseDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString + 'T00:00:00');
  if (isNaN(date.getTime())) return isoString;

  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${dayName}, ${day}/${month}/${year}`;
}

export function DateTimeSlotPicker() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BookingFormData>();

  const selectedDate = watch('booking_date') || formatDateISO(new Date());
  const selectedTime = watch('booking_time') || '';

  const quickDateOptions = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const thisWeekend = new Date(today);
    const dayOfWeek = today.getDay();
    const daysUntilSaturday = dayOfWeek === 6 ? 0 : dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
    thisWeekend.setDate(today.getDate() + daysUntilSaturday);

    return [
      { label: 'Hôm nay', dateStr: formatDateISO(today) },
      { label: 'Ngày mai', dateStr: formatDateISO(tomorrow) },
      { label: 'Cuối tuần này', dateStr: formatDateISO(thisWeekend) },
    ];
  }, []);

  const minDateStr = useMemo(() => formatDateISO(new Date()), []);

  const { data: slotsData, isLoading: isSlotsLoading } = useQuery({
    queryKey: ['available-slots', selectedDate],
    queryFn: () => bookingApi.getAvailableSlots(selectedDate),
    staleTime: 1000 * 60 * 2,
  });

  const rawSlots = slotsData?.slots;
  const slots = Array.isArray(rawSlots) ? rawSlots : Array.isArray(slotsData) ? slotsData : [];
  const morningSlots = slots.filter((s) => {
    if (!s || !s.time) return false;
    if (typeof s.is_morning === 'boolean') return s.is_morning;
    const [h] = s.time.split(':').map(Number);
    return !isNaN(h) && h < 12;
  });
  const afternoonSlots = slots.filter((s) => {
    if (!s || !s.time) return false;
    if (typeof s.is_morning === 'boolean') return !s.is_morning;
    const [h] = s.time.split(':').map(Number);
    return !isNaN(h) && h >= 12;
  });

  const handleDateSelect = (dateStr: string) => {
    setValue('booking_date', dateStr, { shouldValidate: true });
    setValue('booking_time', '', { shouldValidate: true });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setValue('booking_time', slot.time, { shouldValidate: true });
  };

  return (
    <section className="bg-surface-card rounded-[14px] p-5 sm:p-6 border border-rim">
      <div className="flex items-center gap-3 mb-5 pb-3.5 border-b border-rim">
        <div className="w-8 h-8 rounded-[8px] bg-shell-bg text-shell-ink-bright flex items-center justify-center font-mono tabular-nums font-bold text-xs flex-shrink-0">
          03
        </div>
        <div>
          <h2 className="font-bold text-ink-primary text-base sm:text-lg leading-tight">
            Chọn Ngày &amp; Khung Giờ Hẹn
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Khung giờ trống được cập nhật trực tiếp giúp bé không phải chờ lâu tại phòng khám
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Date Selector */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <label htmlFor="booking_date_input" className="text-sm font-semibold text-ink-primary">
              Ngày hẹn khám / chăm sóc <span className="text-state-error-ink">*</span>
            </label>
            {selectedDate && (
              <span className="text-xs text-ink-slate font-semibold bg-surface-subtle px-2.5 py-0.5 rounded-[6px] border border-rim">
                {formatVietnameseDate(selectedDate)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            <div className="sm:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                <CalendarIcon size={16} />
              </div>
              <input
                id="booking_date_input"
                type="date"
                min={minDateStr}
                value={selectedDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-surface-pure border rounded-[10px] text-sm font-mono tabular-nums text-ink-primary focus:outline-none focus:ring-2 transition-colors cursor-pointer ${
                  errors.booking_date
                    ? 'border-state-error-ink focus:ring-state-error-ink/20'
                    : 'border-clay focus:border-control-active-border focus:ring-focus-ring/20'
                }`}
              />
            </div>

            <div className="sm:col-span-7 flex flex-wrap gap-1.5">
              {quickDateOptions.map((opt) => {
                const isSelected = selectedDate === opt.dateStr;
                return (
                  <button
                    key={opt.dateStr}
                    type="button"
                    onClick={() => handleDateSelect(opt.dateStr)}
                    className={`relative px-3 py-2 rounded-[9px] text-xs font-semibold transition-colors cursor-pointer border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                      isSelected
                        ? 'text-control-active-ink border-control-active-border'
                        : 'bg-surface-pure text-ink-primary border-clay hover:border-control-active-border hover:bg-surface-subtle/50'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="date-highlight"
                        className="absolute inset-0 rounded-[inherit] bg-control-active-bg"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {errors.booking_date && (
            <p className="text-xs text-state-error-ink mt-1 font-medium">
              {errors.booking_date.message}
            </p>
          )}
        </div>

        {/* Time Slots */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-ink-primary flex items-center gap-1.5">
              <Clock size={14} className="text-ink-slate" />
              <span>
                Khung giờ hẹn có sẵn <span className="text-state-error-ink">*</span>
              </span>
            </span>
            {isSlotsLoading && (
              <span className="text-xs text-ink-secondary flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin text-accent-collar-ink" />
                <span>Đang cập nhật slot...</span>
              </span>
            )}
          </div>

          {slotsData?.note && (
            <div className="mb-3 p-2.5 bg-state-warning-soft border border-state-warning-border rounded-[9px] text-xs text-state-warning-ink flex items-center gap-2 font-medium">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{slotsData.note}</span>
            </div>
          )}

          {/* Morning */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-state-warning-ink bg-state-warning-soft border border-state-warning-border px-2.5 py-1 rounded-[7px] mb-2.5">
              <Sun size={13} />
              <span>Ca Sáng (08:00 – 12:00)</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {morningSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => handleSlotSelect(slot)}
                    className={`relative py-2 px-1 rounded-[8px] text-xs sm:text-sm font-mono tabular-nums font-semibold transition-colors select-none text-center cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                      isSelected
                        ? 'text-control-active-ink border-control-active-border'
                        : slot.available
                        ? 'bg-surface-pure text-ink-primary border-clay hover:border-control-active-border hover:bg-surface-subtle/50'
                        : 'bg-surface-subtle text-ink-disabled border-rim-disabled cursor-not-allowed line-through'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="time-highlight"
                        className="absolute inset-0 rounded-[inherit] bg-control-active-bg"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{slot.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Afternoon */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-soft-ink bg-slate-soft border border-slate-soft-border px-2.5 py-1 rounded-[7px] mb-2.5">
              <Sunset size={13} />
              <span>Ca Chiều &amp; Tối (14:00 – 19:00)</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {afternoonSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => handleSlotSelect(slot)}
                    className={`relative py-2 px-1 rounded-[8px] text-xs sm:text-sm font-mono tabular-nums font-semibold transition-colors select-none text-center cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                      isSelected
                        ? 'text-control-active-ink border-control-active-border'
                        : slot.available
                        ? 'bg-surface-pure text-ink-primary border-clay hover:border-control-active-border hover:bg-surface-subtle/50'
                        : 'bg-surface-subtle text-ink-disabled border-rim-disabled cursor-not-allowed line-through'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="time-highlight"
                        className="absolute inset-0 rounded-[inherit] bg-control-active-bg"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{slot.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {errors.booking_time && (
            <p className="text-xs text-state-error-ink mt-2 font-medium">
              {errors.booking_time.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
