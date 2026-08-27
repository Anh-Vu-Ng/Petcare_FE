'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BookingFormData, PetType } from '../../types/booking';
import { User, Phone, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const WEIGHT_PRESETS = [
  { label: '3 kg', value: 3, desc: 'Poodle, Phốc sóc' },
  { label: '5 kg', value: 5, desc: 'Mèo ta, Corgi nhỏ' },
  { label: '10 kg', value: 10, desc: 'Shiba, Pug' },
  { label: '15 kg', value: 15, desc: 'Corgi, Bull Pháp' },
  { label: '20+ kg', value: 25, desc: 'Golden, Husky' },
];

export function CustomerPetInfoCard() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BookingFormData>();

  const petType = watch('pet_type');
  const weightKg = watch('weight_kg') || 5;
  const customerPhone = watch('customer_phone') || '';

  const isPhoneValid = /^(03|05|07|08|09)\d{8}$/.test(customerPhone);

  const handlePetTypeSelect = (type: PetType) => {
    setValue('pet_type', type, { shouldValidate: true });
  };

  const handleWeightChange = (newWeight: number) => {
    const clamped = Math.max(0.5, Math.min(60, Number(newWeight)));
    setValue('weight_kg', clamped, { shouldValidate: true });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
      {/* Header section */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm border border-teal-100/80 shadow-xs">
            1
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
              Thông tin Khách hàng & Thú cưng
              <Sparkles size={16} className="text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Vui lòng cung cấp số điện thoại chính xác để nhận thông báo và mã vé
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Row 1: Customer Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Họ và tên khách hàng <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </div>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn An"
                {...register('customer_name')}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.customer_name
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100 focus:bg-white'
                }`}
              />
            </div>
            {errors.customer_name && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                {errors.customer_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>
                Số điện thoại liên hệ <span className="text-rose-500">*</span>
              </span>
              {isPhoneValid && (
                <span className="text-[11px] text-emerald-600 font-normal flex items-center gap-1">
                  <CheckCircle2 size={12} /> Hợp lệ
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                maxLength={10}
                placeholder="VD: 0987654321"
                {...register('customer_phone')}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.customer_phone
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : isPhoneValid
                    ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100 focus:bg-white'
                    : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100 focus:bg-white'
                }`}
              />
            </div>
            {errors.customer_phone && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                {errors.customer_phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Pet Name & Pet Type (Radio cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tên bé cưng <span className="text-slate-400 font-normal">(không bắt buộc)</span>
            </label>
            <input
              type="text"
              placeholder="VD: Mimi, Bơ, Lu, Cà Phê..."
              {...register('pet_name')}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:bg-white transition-all"
            />
          </div>

          <div className="sm:col-span-7">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Loài thú cưng <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'dog' as PetType, label: 'Cún Cưng', icon: '🐶' },
                { type: 'cat' as PetType, label: 'Mèo Cưng', icon: '🐱' },
                { type: 'other' as PetType, label: 'Khác', icon: '🐾' },
              ].map((item) => {
                const isSelected = petType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handlePetTypeSelect(item.type)}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                      isSelected
                        ? 'bg-teal-500 text-white border-teal-500 shadow-sm shadow-teal-500/20'
                        : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.pet_type && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                {errors.pet_type.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Pet Weight Slider & Quick Presets */}
        <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Cân nặng của bé:
              </label>
              <span className="text-[11px] text-slate-400">(Quyết định giá dịch vụ Spa & Khách sạn)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white border border-teal-200 px-3 py-1 rounded-xl shadow-xs">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="60"
                value={weightKg}
                onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0.5)}
                className="w-12 text-center text-sm font-extrabold text-teal-600 focus:outline-none"
              />
              <span className="text-xs font-bold text-teal-600">kg</span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="relative mb-3.5 px-1">
            <input
              type="range"
              min="0.5"
              max="40"
              step="0.5"
              value={weightKg}
              onChange={(e) => handleWeightChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5 mt-1">
              <span>0.5kg</span>
              <span>10kg</span>
              <span>20kg</span>
              <span>30kg</span>
              <span>40kg+</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 self-center mr-1">Chọn nhanh:</span>
            {WEIGHT_PRESETS.map((preset) => {
              const isCurrent = Math.abs(weightKg - preset.value) < 0.5;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleWeightChange(preset.value)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-teal-100 text-teal-700 border-teal-300 font-bold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                  title={preset.desc}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
