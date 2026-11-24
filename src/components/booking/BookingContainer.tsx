'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  bookingFormSchema,
  BookingFormData,
  BookingDetail,
  PetType,
} from '../../types/booking';
import { bookingApi } from '../../services/bookingApi';
import { CustomerPetInfoCard } from './CustomerPetInfoCard';
import { ServiceSelectorGrid } from './ServiceSelectorGrid';
import { DateTimeSlotPicker } from './DateTimeSlotPicker';
import { LivePriceSummaryCard } from './LivePriceSummaryCard';
import { BookingConfirmationModal } from './BookingConfirmationModal';

interface BookingContainerProps {
  onSwitchToChat?: () => void;
  prefillService?: string;
  initialPetType?: PetType;
  initialWeightKg?: number;
}

function getTodayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function BookingContainer({
  onSwitchToChat,
  prefillService,
  initialPetType = 'dog',
  initialWeightKg = 5,
}: BookingContainerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const methods = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      pet_name: '',
      pet_type: initialPetType,
      weight_kg: initialWeightKg,
      services: prefillService ? [prefillService] : ['bath'],
      booking_date: getTodayISO(),
      booking_time: '',
      duration_days: 1,
      notes: '',
    },
    mode: 'onTouched',
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (prefillService) {
      setValue('services', [prefillService], { shouldValidate: true });
    }
  }, [prefillService, setValue]);

  useEffect(() => {
    setValue('pet_type', initialPetType, { shouldValidate: true });
  }, [initialPetType, setValue]);

  useEffect(() => {
    setValue('weight_kg', initialWeightKg, { shouldValidate: true });
  }, [initialWeightKg, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const res = await bookingApi.createBooking(data);
      if (res.success && res.booking) {
        setCreatedBooking(res.booking);
        setIsModalOpen(true);
        toast.success('Đặt lịch hẹn chăm sóc thú cưng thành công!');
      } else {
        toast.error(res.message || 'Không thể tạo đơn đặt lịch, vui lòng thử lại.');
      }
    } catch (error: unknown) {
      console.error('Booking submission failed:', error);
      const message =
        error instanceof Error ? error.message : 'Có lỗi xảy ra trong quá trình đặt lịch.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewBooking = () => {
    reset({
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      pet_name: '',
      pet_type: initialPetType,
      weight_kg: initialWeightKg,
      services: ['bath'],
      booking_date: getTodayISO(),
      booking_time: '',
      duration_days: 1,
      notes: '',
    });
    setIsModalOpen(false);
    setCreatedBooking(null);
  };

  return (
    <div className="w-full">
      {/* Crisp Operate Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-rim pb-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-ink-slate tracking-[-0.02em]">
            Đặt Lịch Chăm Sóc &amp; Khám Bệnh
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1 leading-relaxed">
            Điền thông tin bé cưng và chọn khung giờ phù hợp. Chi phí được cập nhật tự động theo cân nặng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-[7px] bg-surface-card border border-rim text-ink-primary">
            1. Hồ sơ bé
          </span>
          <span className="px-2.5 py-1 rounded-[7px] bg-surface-card border border-rim text-ink-primary">
            2. Dịch vụ
          </span>
          <span className="px-2.5 py-1 rounded-[7px] bg-surface-card border border-rim text-ink-primary">
            3. Giờ hẹn
          </span>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
            {/* Form Steps Column */}
            <div className="flex flex-col gap-5 min-w-0">
              <CustomerPetInfoCard />
              <ServiceSelectorGrid />
              <DateTimeSlotPicker />
            </div>

            {/* Sticky Live Ledger Sidebar */}
            <div className="lg:sticky lg:top-[84px]">
              <LivePriceSummaryCard isSubmitting={isSubmitting} />
            </div>
          </div>
        </form>
      </FormProvider>

      <BookingConfirmationModal
        booking={createdBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNewBooking={handleNewBooking}
        onSwitchToChat={() => {
          setIsModalOpen(false);
          if (onSwitchToChat) onSwitchToChat();
        }}
      />
    </div>
  );
}
