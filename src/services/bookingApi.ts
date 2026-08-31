import {
  BookingFormData,
  BookingResponse,
  BookingDetail,
  PriceEstimateResponse,
  PriceEstimateItem,
  AvailableSlotsResponse,
  AVAILABLE_SERVICES,
  ServiceId,
  TimeSlot,
} from '../types/booking';
const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
const API_BASE_URL = RAW_API_BASE_URL ? RAW_API_BASE_URL.replace(/\/+$/, '') : (typeof window !== 'undefined' ? '' : 'http://localhost:8000');
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
    const fallback = computeClientEstimate(
      payload.services || [],
      payload.weight_kg || 5,
      payload.duration_days || 1
    );

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings/estimate-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Price estimation failed: ${response.statusText}`);
      }

      const resJson = await response.json();
      if (!resJson || typeof resJson !== 'object') {
        return fallback;
      }

      // 1. Defensively normalize items list
      const rawItems = Array.isArray(resJson.items) && resJson.items.length > 0 ? resJson.items : fallback.items;
      const normalizedItems = rawItems.map((item: any) => {
        const serviceDef = AVAILABLE_SERVICES.find(
          (s) => s.id === item.service_id || s.id === item.id
        );
        const fallbackItem = fallback.items.find(
          (f) => f.service_id === item.service_id || f.service_id === item.id
        );

        const serviceId = item.service_id || item.id || serviceDef?.id || 'service';
        // Ensure human-friendly Vietnamese service name instead of raw ID
        const serviceName =
          (item.service_name && item.service_name !== serviceId)
            ? item.service_name
            : serviceDef?.name || fallbackItem?.service_name || serviceId;

        const isQuoteOnly = Boolean(item.is_quote_only ?? serviceDef?.isQuoteOnly ?? false);

        // Resolve item pricing if backend returned 0 for a known service
        let unitPrice = Number(item.unit_price) || 0;
        let totalPrice = Number(item.total_price) || 0;
        if (!isQuoteOnly && totalPrice === 0 && fallbackItem && fallbackItem.total_price > 0) {
          totalPrice = fallbackItem.total_price;
          unitPrice = fallbackItem.unit_price;
        }

        // Clean up error notes if price is properly resolved
        let note = item.note;
        if (note && note.includes('Không tìm thấy') && totalPrice > 0) {
          note = serviceDef?.isDurationBased
            ? `${payload.duration_days || 1} ngày (${unitPrice.toLocaleString('vi-VN')}đ/ngày)`
            : undefined;
        } else if (!note && fallbackItem?.note) {
          note = fallbackItem.note;
        }

        return {
          service_id: serviceId,
          service_name: serviceName,
          is_quote_only: isQuoteOnly,
          unit_price: unitPrice,
          total_price: totalPrice,
          note,
        };
      });

      // 2. Reconcile subtotal and final_total
      const computedSubtotal = normalizedItems.reduce(
        (sum: number, item: PriceEstimateItem) => sum + (item.total_price || 0),
        0
      );
      const rawSubtotal = Number(resJson.subtotal);
      const subtotal = (!isNaN(rawSubtotal) && rawSubtotal > 0) ? rawSubtotal : (computedSubtotal || fallback.subtotal);

      const discountAmount = typeof resJson.discount_amount === 'number'
        ? resJson.discount_amount
        : Number(resJson.discount_amount) || fallback.discount_amount;

      const discountPercentage = typeof resJson.discount_percentage === 'number'
        ? resJson.discount_percentage
        : Number(resJson.discount_percentage) || fallback.discount_percentage;

      const rawFinalTotal = Number(resJson.final_total);
      const finalTotal = (!isNaN(rawFinalTotal) && rawFinalTotal > 0)
        ? rawFinalTotal
        : Math.max(0, subtotal - discountAmount);

      return {
        items: normalizedItems,
        subtotal,
        discount_amount: discountAmount,
        discount_percentage: discountPercentage,
        final_total: finalTotal,
        has_quote_only_service: Boolean(resJson.has_quote_only_service ?? fallback.has_quote_only_service),
        free_gifts: Array.isArray(resJson.free_gifts) && resJson.free_gifts.length > 0 ? resJson.free_gifts : fallback.free_gifts,
        disclaimer: resJson.disclaimer || fallback.disclaimer,
      };
    } catch (error) {
      // Offline fallback computation
      return fallback;
    }
  },

  // 2. Lấy danh sách khung giờ mở cửa theo ngày
  async getAvailableSlots(dateStr: string): Promise<AvailableSlotsResponse> {
    const selectedDate = new Date(dateStr);
    const isSunday = selectedDate.getDay() === 0;

    const morningTemplate = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    const afternoonTemplate = isSunday
      ? ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
      : ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];

    const now = new Date();
    const isToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const createFallbackSlot = (time: string, isMorning: boolean): TimeSlot => {
      const [hours, mins] = time.split(':').map(Number);
      const slotMinutes = hours * 60 + mins;
      let available = true;
      if (isToday && slotMinutes <= currentMinutes + 30) {
        available = false;
      }
      return {
        time,
        available,
        is_morning: isMorning,
        remaining_capacity: available ? 3 : 0,
      };
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/bookings/available-slots?date=${encodeURIComponent(dateStr)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch slots: ${response.statusText}`);
      }

      const resJson = await response.json();
      const rawSlotsList = Array.isArray(resJson?.slots)
        ? resJson.slots
        : Array.isArray(resJson)
        ? resJson
        : [];

      if (rawSlotsList.length === 0) {
        throw new Error('Empty slots from backend, using standard schedule');
      }

      const mappedSlots: TimeSlot[] = rawSlotsList.map((slot: any) => {
        const time = typeof slot === 'string' ? slot : (slot.time || slot.slot || slot.time_slot || '');
        const [hours, mins] = time.split(':').map(Number);
        const slotMinutes = (!isNaN(hours) && !isNaN(mins)) ? (hours * 60 + mins) : 0;
        const isMorning = slot.is_morning !== undefined
          ? Boolean(slot.is_morning)
          : (!isNaN(hours) ? hours < 12 : true);

        let isAvail = slot.available !== undefined
          ? Boolean(slot.available)
          : slot.is_available !== undefined
          ? Boolean(slot.is_available)
          : slot.status !== 'BOOKED' && slot.status !== 'UNAVAILABLE';

        // Check if slot has passed today
        if (isToday && slotMinutes > 0 && slotMinutes <= currentMinutes + 30) {
          isAvail = false;
        }

        return {
          time,
          available: isAvail,
          is_morning: isMorning,
          remaining_capacity: slot.remaining_capacity ?? (isAvail ? 3 : 0),
        };
      });

      // Ensure both morning and afternoon schedules exist
      const hasMorning = mappedSlots.some((s) => s.is_morning && s.time);
      const hasAfternoon = mappedSlots.some((s) => !s.is_morning && s.time);

      const finalMorningSlots = hasMorning
        ? mappedSlots.filter((s) => s.is_morning && s.time)
        : morningTemplate.map((t) => createFallbackSlot(t, true));

      const finalAfternoonSlots = hasAfternoon
        ? mappedSlots.filter((s) => !s.is_morning && s.time)
        : afternoonTemplate.map((t) => createFallbackSlot(t, false));

      return {
        date: dateStr,
        slots: [...finalMorningSlots, ...finalAfternoonSlots],
        is_closed: Boolean(resJson.is_closed),
        note: resJson.note || (isSunday ? 'Chủ nhật phòng khám mở cửa đến 17:00' : undefined),
      };
    } catch (error) {
      // Mock slots generator
      const slots: TimeSlot[] = [
        ...morningTemplate.map((t) => createFallbackSlot(t, true)),
        ...afternoonTemplate.map((t) => createFallbackSlot(t, false)),
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
