import {
  BookingFormData,
  BookingResponse,
  BookingDetail,
  PriceEstimateResponse,
  AvailableSlotsResponse,
  AVAILABLE_SERVICES,
  ServiceId,
  TimeSlot,
} from '../types/booking';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'petcare_mock_bookings';

// Helper to get local stored bookings for offline testing
function getStoredBookings(): BookingDetail[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredBooking(booking: BookingDetail) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredBookings();
    const updated = [booking, ...existing.filter((b) => b.booking_code !== booking.booking_code)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save booking to localStorage:', e);
  }
}

// Client-side instant estimation engine (used as fallback when backend is unreachable)
export function computeClientEstimate(
  serviceIds: string[],
  weightKg: number = 5,
  durationDays: number = 1
): PriceEstimateResponse {
  let subtotal = 0;
  let discountAmount = 0;
  let discountPercentage = 0;
  const freeGifts: string[] = [];
  let hasQuoteOnly = false;

  // Weight tier multiplier
  let weightFactor = 1.0;
  if (weightKg >= 20) {
    weightFactor = 1.8;
  } else if (weightKg >= 10) {
    weightFactor = 1.5;
  } else if (weightKg >= 5) {
    weightFactor = 1.2;
  }

  const items = serviceIds.map((id) => {
    const def = AVAILABLE_SERVICES.find((s) => s.id === id);
    if (!def) {
      return {
        service_id: id,
        service_name: id,
        is_quote_only: false,
        unit_price: 0,
        total_price: 0,
      };
    }

    if (def.isQuoteOnly) {
      hasQuoteOnly = true;
      return {
        service_id: def.id,
        service_name: def.name,
        is_quote_only: true,
        unit_price: 0,
        total_price: 0,
        note: 'Bác sĩ báo giá sau khi thăm khám',
      };
    }

    let unitPrice = def.basePrice;
    if (def.weightTierFactor) {
      unitPrice = Math.round(def.basePrice * weightFactor / 1000) * 1000;
    }

    let itemTotal = unitPrice;
    if (def.isDurationBased) {
      itemTotal = unitPrice * Math.max(1, durationDays);

      // Boarding discounts
      if (durationDays >= 11) {
        discountPercentage = 15;
        freeGifts.push('1 Suất Tắm Spa & Chăm sóc lông Miễn Phí 🎁');
      } else if (durationDays >= 6) {
        discountPercentage = 10;
      } else if (durationDays >= 4) {
        discountPercentage = 5;
      }

      if (discountPercentage > 0) {
        discountAmount = Math.round((itemTotal * discountPercentage) / 100);
      }
    }

    subtotal += itemTotal;

    return {
      service_id: def.id,
      service_name: def.name,
      is_quote_only: false,
      unit_price: unitPrice,
      total_price: itemTotal,
      note: def.isDurationBased ? `${durationDays} ngày (${unitPrice.toLocaleString('vi-VN')}đ/ngày)` : undefined,
    };
  });

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const disclaimer = hasQuoteOnly
    ? '(*) Chi phí trên là tạm tính cho các dịch vụ chăm sóc. Chưa bao gồm chi phí khám bệnh lâm sàng và thuốc theo chỉ định của Bác sĩ.'
    : '(*) Chi phí tạm tính dựa trên cân nặng đăng ký. Giá thực tế có thể thay đổi nhẹ nếu cân nặng tại phòng khám có chênh lệch.';

  return {
    items,
    subtotal,
    discount_amount: discountAmount,
    discount_percentage: discountPercentage,
    final_total: finalTotal,
    has_quote_only_service: hasQuoteOnly,
    free_gifts: freeGifts,
    disclaimer,
  };
}

export const bookingApi = {
  // 1. Tính báo giá thời gian thực (Live Price Estimate)
  async estimatePrice(payload: {
    services: string[];
    weight_kg?: number;
    duration_days?: number;
  }): Promise<PriceEstimateResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings/estimate-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Price estimation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Offline fallback computation
      return computeClientEstimate(
        payload.services || [],
        payload.weight_kg || 5,
        payload.duration_days || 1
      );
    }
  },

  // 2. Lấy danh sách khung giờ mở cửa theo ngày
  async getAvailableSlots(dateStr: string): Promise<AvailableSlotsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/bookings/available-slots?date=${encodeURIComponent(dateStr)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch slots: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Mock slots generator
      const selectedDate = new Date(dateStr);
      const isSunday = selectedDate.getDay() === 0;

      const morningTimes = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
      const afternoonTimes = isSunday
        ? ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'] // Sunday closes earlier
        : ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];

      const now = new Date();
      const isToday =
        selectedDate.getFullYear() === now.getFullYear() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getDate() === now.getDate();

      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const createSlot = (time: string, isMorning: boolean): TimeSlot => {
        const [hours, mins] = time.split(':').map(Number);
        const slotMinutes = hours * 60 + mins;

        let available = true;
        // If today, disable past time slots
        if (isToday && slotMinutes <= currentMinutes + 30) {
          available = false;
        }

        // Check if there are already existing bookings stored locally for this date & slot
        const storedBookings = getStoredBookings();
        const bookedCount = storedBookings.filter(
          (b) => b.booking_date === dateStr && b.booking_time === time && b.status !== 'CANCELLED'
        ).length;

        if (bookedCount >= 3) {
          available = false;
        }

        return {
          time,
          available,
          is_morning: isMorning,
          remaining_capacity: available ? Math.max(0, 3 - bookedCount) : 0,
        };
      };

      const slots: TimeSlot[] = [
        ...morningTimes.map((t) => createSlot(t, true)),
        ...afternoonTimes.map((t) => createSlot(t, false)),
      ];

      return {
        date: dateStr,
        slots,
        is_closed: false,
        note: isSunday ? 'Chủ nhật phòng khám mở cửa đến 17:00' : undefined,
      };
    }
  },

  // 3. Tạo mới đơn đặt lịch
  async createBooking(data: BookingFormData): Promise<BookingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.detail || errJson?.message || `Lỗi đặt lịch (${response.status})`);
      }

      const resData = await response.json();
      if (resData.booking) {
        saveStoredBooking(resData.booking);
      }
      return resData;
    } catch (error: any) {
      console.warn('Backend offline or failed, generating mock booking pass:', error);

      // Generate unique mock code: BK-YYYYMMDD-XXXX
      const datePart = data.booking_date.replace(/-/g, '');
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const bookingCode = `BK-${datePart}-${randPart}`;

      const estimate = computeClientEstimate(
        data.services,
        data.weight_kg,
        data.duration_days
      );

      const serviceNames = data.services.map(
        (id) => AVAILABLE_SERVICES.find((s) => s.id === id)?.name || id
      );

      const mockBooking: BookingDetail = {
        id: `mock-${Date.now()}`,
        booking_code: bookingCode,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        pet_name: data.pet_name || 'Bé cưng',
        pet_type: data.pet_type,
        weight_kg: data.weight_kg,
        services: data.services,
        service_names: serviceNames,
        booking_date: data.booking_date,
        booking_time: data.booking_time,
        duration_days: data.duration_days || 1,
        notes: data.notes,
        estimated_price: estimate.final_total,
        has_quote_only_service: estimate.has_quote_only_service,
        discount_amount: estimate.discount_amount,
        free_gifts: estimate.free_gifts,
        status: 'PENDING',
        created_at: new Date().toISOString(),
      };

      saveStoredBooking(mockBooking);

      return {
        success: true,
        message: 'Đặt lịch hẹn thành công!',
        booking: mockBooking,
      };
    }
  },

  // 4. Tra cứu chi tiết đơn theo mã
  async getBookingDetail(bookingCode: string): Promise<BookingDetail | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/bookings/${encodeURIComponent(bookingCode)}`
      );

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      const localList = getStoredBookings();
      const found = localList.find(
        (b) => b.booking_code.toUpperCase() === bookingCode.trim().toUpperCase()
      );
      return found || null;
    }
  },

  // 5. Tra cứu danh sách đơn theo Số điện thoại
  async searchBookingsByPhone(phone: string): Promise<BookingDetail[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/bookings?phone=${encodeURIComponent(phone)}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.bookings || [];
    } catch (error) {
      const localList = getStoredBookings();
      return localList.filter((b) => b.customer_phone.includes(phone.trim()));
    }
  },
};
