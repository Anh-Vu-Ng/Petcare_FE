'use client';

import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { BookingFormData, TimeSlot } from '../../types/booking';
import { bookingApi } from '../../services/bookingApi';
import { Calendar as CalendarIcon, Clock, Sun, Sunset, AlertCircle, Loader2 } from 'lucide-react';

// Format YYYY-MM-DD
function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Format Vietnamese display date
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

  // Quick date options generator
  const quickDateOptions = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Calculate this weekend (Saturday or Sunday)
    const thisWeekend = new Date(today);
    const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    const daysUntilSaturday = dayOfWeek === 6 ? 0 : dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
    thisWeekend.setDate(today.getDate() + daysUntilSaturday);

    return [
      { label: 'Hôm nay', dateStr: formatDateISO(today) },
      { label: 'Ngày mai', dateStr: formatDateISO(tomorrow) },
      { label: 'Cuối tuần này', dateStr: formatDateISO(thisWeekend) },
    ];
  }, []);

  const minDateStr = useMemo(() => formatDateISO(new Date()), []);

  // Fetch available slots from backend with TanStack Query
  const { data: slotsData, isLoading: isSlotsLoading } = useQuery({
    queryKey: ['available-slots', selectedDate],
    queryFn: () => bookingApi.getAvailableSlots(selectedDate),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const slots = slotsData?.slots || [];
  const morningSlots = slots.filter((s) => s.is_morning);
  const afternoonSlots = slots.filter((s) => !s.is_morning);

  const handleDateSelect = (dateStr: string) => {
    setValue('booking_date', dateStr, { shouldValidate: true });
    // Reset selected time if it's no longer available on the new date
    setValue('booking_time', '', { shouldValidate: true });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setValue('booking_time', slot.time, { shouldValidate: true });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm border border-teal-100/80 shadow-xs">
            3
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
              Chọn Ngày & Khung Giờ Hẹn
            </h3>
            <p className="text-xs text-slate-400">
              Khung giờ trống được cập nhật theo thời gian thực để tránh chờ đợi tại phòng khám
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Date Selector Section */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>
              Ngày hẹn khám / chăm sóc <span className="text-rose-500">*</span>
            </span>
            {selectedDate && (
              <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">
                {formatVietnameseDate(selectedDate)}
              </span>
            )}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            {/* Native Date input with minimum today constraint */}
            <div className="sm:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CalendarIcon size={16} />
              </div>
              <input
                type="date"
                min={minDateStr}
                value={selectedDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                  errors.booking_date
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100 focus:bg-white'
                }`}
              />
            </div>

            {/* Quick date buttons */}
            <div className="sm:col-span-7 flex flex-wrap gap-1.5">
              {quickDateOptions.map((opt) => {
                const isSelected = selectedDate === opt.dateStr;
                return (
                  <button
                    key={opt.dateStr}
                    type="button"
                    onClick={() => handleDateSelect(opt.dateStr)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none active:scale-95 ${
                      isSelected
                        ? 'bg-teal-500 text-white border-teal-500 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          {errors.booking_date && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">
              {errors.booking_date.message}
            </p>
          )}
        </div>

        {/* Time Slots Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock size={14} className="text-teal-600" />
              Khung giờ hẹn có sẵn <span className="text-rose-500">*</span>
            </label>
            {isSlotsLoading && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Loader2 size={12} className="animate-spin text-teal-500" /> Đang cập nhật slot...
              </span>
            )}
          </div>

          {slotsData?.note && (
            <div className="mb-3 p-2 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 flex items-center gap-1.5">
              <AlertCircle size={13} className="text-amber-600 flex-shrink-0" />
              <span>{slotsData.note}</span>
            </div>
          )}

          {/* Morning Slots */}
          <div className="mb-4">
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg w-max mb-2">
              <Sun size={13} className="text-amber-600" />
              <span>Ca Sáng (08:00 - 12:00)</span>
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
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all select-none text-center cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20 scale-102'
                        : slot.available
                        ? 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 hover:text-teal-700 active:scale-95'
                        : 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed line-through opacity-60'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div>
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-indigo-800 bg-indigo-50/80 px-2.5 py-1 rounded-lg w-max mb-2">
              <Sunset size={13} className="text-indigo-600" />
              <span>Ca Chiều & Tối (14:00 - 19:00)</span>
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
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all select-none text-center cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20 scale-102'
                        : slot.available
                        ? 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 hover:text-teal-700 active:scale-95'
                        : 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed line-through opacity-60'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>

          {errors.booking_time && (
            <p className="text-[11px] text-rose-500 mt-2 font-medium">
              {errors.booking_time.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
