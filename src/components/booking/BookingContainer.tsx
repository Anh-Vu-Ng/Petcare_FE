'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { bookingFormSchema, BookingFormData, BookingDetail } from '../../types/booking';
import { bookingApi } from '../../services/bookingApi';
import { CustomerPetInfoCard } from './CustomerPetInfoCard';
import { ServiceSelectorGrid } from './ServiceSelectorGrid';
import { DateTimeSlotPicker } from './DateTimeSlotPicker';
import { LivePriceSummaryCard } from './LivePriceSummaryCard';
import { BookingConfirmationModal } from './BookingConfirmationModal';
import { Sparkles, CalendarHeart } from 'lucide-react';

interface BookingContainerProps {
  onSwitchToChat?: () => void;
  prefillService?: string;
}

// Format YYYY-MM-DD for today
function getTodayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function BookingContainer({ onSwitchToChat, prefillService }: BookingContainerProps) {
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
      pet_type: 'dog',
      weight_kg: 5,
      services: prefillService ? [prefillService] : ['bath'],
      booking_date: getTodayISO(),
      booking_time: '',
      duration_days: 1,
      notes: '',
    },
    mode: 'onTouched',
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const res = await bookingApi.createBooking(data);
      if (res.success && res.booking) {
        setCreatedBooking(res.booking);
        setIsModalOpen(true);
        toast.success('Đặt lịch hẹn chăm sóc thú cưng thành công! 🎉');
      } else {
        toast.error(res.message || 'Không thể tạo đơn đặt lịch, vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Booking submission failed:', error);
      toast.error(error.message || 'Có lỗi xảy ra trong quá trình đặt lịch.');
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
      pet_type: 'dog',
      weight_kg: 5,
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
      {/* Banner / Header Title */}
      <div className="mb-6 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold mb-2">
          <CalendarHeart size={14} className="text-teal-600" />
          <span>Đặt Lịch Hẹn Trực Tuyến Tiết Kiệm Thời Gian</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Chăm Sóc & Khám Bệnh Thú Cưng Petcare
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Điền thông tin bé cưng và chọn khung giờ phù hợp. Chi phí sẽ được tự động tính toán tức thì theo cân nặng.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form Sections - Single Column Flow */}
          <div className="max-w-4xl mx-auto flex flex-col gap-6 pt-2">
            {/* Section 1: Customer & Pet Information */}
            <CustomerPetInfoCard />

            {/* Section 2: Service Selection Grid */}
            <ServiceSelectorGrid />

            {/* Section 3: Date & Time Picker */}
            <DateTimeSlotPicker />

            {/* Section 4: Live Pricing Ticket - Bottom of page */}
            <LivePriceSummaryCard isSubmitting={isSubmitting} />
          </div>
        </form>
      </FormProvider>

      {/* Booking Confirmation Pass Modal */}
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
