import { z } from 'zod';

export type PetType = 'dog' | 'cat' | 'other';

export type ServiceId = 
  | 'bath'
  | 'trim'
  | 'nail'
  | 'ear'
  | 'anal_glands'
  | 'medical'
  | 'boarding';

export interface ServiceDefinition {
  id: ServiceId;
  name: string;
  shortName: string;
  category: 'spa' | 'medical' | 'hotel';
  description: string;
  iconName: string;
  basePrice: number; // Base price in VND
  isQuoteOnly?: boolean; // True for 'medical' (bác sĩ báo giá sau)
  isDurationBased?: boolean; // True for 'boarding'
  weightTierFactor?: boolean; // Changes with pet weight
  badge?: string;
  popular?: boolean;
}

export const AVAILABLE_SERVICES: ServiceDefinition[] = [
  {
    id: 'bath',
    name: 'Tắm Spa & Chăm Sóc Lông',
    shortName: 'Tắm Spa',
    category: 'spa',
    description: 'Tắm thảo mộc, sấy phồng, chải lông mượt, xịt dưỡng thơm lâu tự nhiên.',
    iconName: 'Bath',
    basePrice: 150000,
    weightTierFactor: true,
    popular: true,
  },
  {
    id: 'trim',
    name: 'Cạo Lông & Cắt Tỉa Tạo Kiểu',
    shortName: 'Cắt Tỉa Lông',
    category: 'spa',
    description: 'Cắt tỉa gọn gàng, tạo phom gấu Teddy, phom sư tử hoặc cạo mát mùa hè.',
    iconName: 'Scissors',
    basePrice: 180000,
    weightTierFactor: true,
  },
  {
    id: 'nail',
    name: 'Cắt & Mài Móng An Toàn',
    shortName: 'Cắt Mài Móng',
    category: 'spa',
    description: 'Bấm tỉa chuẩn độ dài, mài mịn góc cạnh tránh cào xước đồ vật.',
    iconName: 'Sparkles',
    basePrice: 50000,
    weightTierFactor: false,
  },
  {
    id: 'ear',
    name: 'Vệ Sinh Tai & Nhổ Lông Tai',
    shortName: 'Vệ Sinh Tai',
    category: 'spa',
    description: 'Làm sạch ráy tai, diệt khuẩn ngừa ve tai, khử mùi hôi khoang tai.',
    iconName: 'Ear',
    basePrice: 60000,
    weightTierFactor: false,
  },
  {
    id: 'anal_glands',
    name: 'Vắt Tuyến Hôi Hậu Môn',
    shortName: 'Vắt Tuyến Hôi',
    category: 'spa',
    description: 'Xử lý túi dịch thừa sau hậu môn, giúp bé thoải mái và không còn mùi khó chịu.',
    iconName: 'Flame',
    basePrice: 70000,
    weightTierFactor: false,
  },
  {
    id: 'medical',
    name: 'Khám Bệnh & Tư Vấn Sức Khỏe',
    shortName: 'Khám Bệnh',
    category: 'medical',
    description: 'Thăm khám lâm sàng tổng quát, chẩn đoán triệu chứng và tư vấn phác đồ bởi Bác sĩ thú y.',
    iconName: 'Stethoscope',
    basePrice: 0,
    isQuoteOnly: true,
    badge: 'Bác sĩ báo giá sau khám',
    popular: true,
  },
  {
    id: 'boarding',
    name: 'Khách Sạn Thú Cưng (Lưu Trú 24h)',
    shortName: 'Lưu Trú 24h',
    category: 'hotel',
    description: 'Phòng máy lạnh riêng biệt, camera 24/7, thực đơn cao cấp 3 bữa/ngày, vui chơi tự do.',
    iconName: 'Hotel',
    basePrice: 160000,
    isDurationBased: true,
    weightTierFactor: true,
    badge: 'Ưu đãi đến 15% + Quà tặng',
  },
];

// Zod Schema for Booking Form
export const bookingFormSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)')
    .max(100, 'Họ tên tối đa 100 ký tự'),
  customer_phone: z
    .string()
    .regex(/^(03|05|07|08|09)\d{8}$/, 'Số điện thoại không hợp lệ (cần đúng 10 số di động VN)'),
  customer_email: z
    .string()
    .email('Email không đúng định dạng')
    .optional()
    .or(z.literal('')),
  pet_name: z
    .string()
    .max(50, 'Tên thú cưng tối đa 50 ký tự')
    .optional()
    .or(z.literal('')),
  pet_type: z.enum(['dog', 'cat', 'other'] as const, {
    errorMap: () => ({ message: 'Vui lòng chọn loại thú cưng' }),
  }),
  weight_kg: z
    .number()
    .min(0.1, 'Cân nặng phải lớn hơn 0kg')
    .max(100, 'Cân nặng tối đa 100kg'),
  services: z
    .array(z.string())
    .min(1, 'Vui lòng chọn ít nhất 1 dịch vụ chăm sóc hoặc khám bệnh'),
  booking_date: z
    .string()
    .min(1, 'Vui lòng chọn ngày hẹn'),
  booking_time: z
    .string()
    .min(1, 'Vui lòng chọn khung giờ hẹn'),
  duration_days: z
    .number()
    .min(1, 'Thời gian lưu trú tối thiểu 1 ngày')
    .max(30, 'Thời gian lưu trú tối đa 30 ngày')
    .default(1),
  notes: z
    .string()
    .max(500, 'Ghi chú tối đa 500 ký tự')
    .optional()
    .or(z.literal('')),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export interface PriceEstimateItem {
  service_id: string;
  service_name: string;
  is_quote_only: boolean;
  unit_price: number;
  total_price: number;
  note?: string;
}

export interface PriceEstimateResponse {
  items: PriceEstimateItem[];
  subtotal: number;
  discount_amount: number;
  discount_percentage: number;
  final_total: number;
  has_quote_only_service: boolean;
  free_gifts: string[];
  disclaimer: string;
}

export interface TimeSlot {
  time: string; // e.g. "09:30"
  available: boolean;
  is_morning: boolean;
  remaining_capacity?: number;
}

export interface AvailableSlotsResponse {
  date: string;
  slots: TimeSlot[];
  is_closed: boolean;
  note?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface BookingDetail {
  id: string;
  booking_code: string; // e.g. "BK-20260828-A8F2"
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  pet_name?: string;
  pet_type: PetType;
  weight_kg: number;
  services: string[];
  service_names: string[];
  booking_date: string;
  booking_time: string;
  duration_days: number;
  notes?: string;
  estimated_price: number;
  has_quote_only_service: boolean;
  discount_amount: number;
  free_gifts: string[];
  status: BookingStatus;
  created_at: string;
  updated_at?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking: BookingDetail;
}
