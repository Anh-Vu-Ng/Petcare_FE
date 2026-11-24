'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { BookingFormData, PetType } from '../../types/booking';
import { User, Phone, CheckCircle2, Dog, Cat, PawPrint } from 'lucide-react';

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

  const [weightInput, setWeightInput] = useState(String(weightKg));

  useEffect(() => {
    setWeightInput(String(weightKg));
  }, [weightKg]);

  const isPhoneValid = /^(03|05|07|08|09)\d{8}$/.test(customerPhone);

  const handlePetTypeSelect = (type: PetType) => {
    setValue('pet_type', type, { shouldValidate: true });
  };

  const handleWeightChange = (newWeight: number) => {
    const clamped = Math.max(0.5, Math.min(60, Number(newWeight)));
    setValue('weight_kg', clamped, { shouldValidate: true });
    setWeightInput(String(clamped));
  };

  const handleWeightTextChange = (raw: string) => {
    setWeightInput(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 60) {
      setValue('weight_kg', parsed, { shouldValidate: true });
    }
  };

  const handleWeightBlur = () => {
    const parsed = parseFloat(weightInput);
    if (isNaN(parsed) || parsed < 0.5) {
      handleWeightChange(0.5);
    } else {
      handleWeightChange(parsed);
    }
  };

  const petChoices: { type: PetType; label: string; icon: React.ReactNode }[] = [
    { type: 'dog', label: 'Cún Cưng', icon: <Dog size={16} /> },
    { type: 'cat', label: 'Mèo Cưng', icon: <Cat size={16} /> },
    { type: 'other', label: 'Khác', icon: <PawPrint size={16} /> },
  ];

  return (
    <section className="bg-surface-card rounded-[14px] p-5 sm:p-6 border border-rim">
      <div className="flex items-center gap-3 mb-5 pb-3.5 border-b border-rim">
        <div className="w-8 h-8 rounded-[8px] bg-shell-bg text-shell-ink-bright flex items-center justify-center font-mono tabular-nums font-bold text-xs flex-shrink-0">
          01
        </div>
        <div>
          <h2 className="font-bold text-ink-primary text-base sm:text-lg leading-tight">
            Thông tin Khách hàng &amp; Thú cưng
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Số điện thoại chính xác dùng để xác nhận lịch hẹn và tra cứu mã check-in
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Customer Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="customer_name"
              className="block text-sm font-semibold text-ink-primary mb-1.5"
            >
              Họ và tên khách hàng <span className="text-state-error-ink">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                <User size={16} />
              </div>
              <input
                id="customer_name"
                type="text"
                placeholder="VD: Nguyễn Văn An"
                {...register('customer_name')}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-surface-pure border rounded-[10px] text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:ring-2 transition-colors ${
                  errors.customer_name
                    ? 'border-state-error-ink focus:ring-state-error-ink/20'
                    : 'border-clay focus:border-control-active-border focus:ring-focus-ring/20'
                }`}
              />
            </div>
            {errors.customer_name && (
              <p className="text-xs text-state-error-ink mt-1 font-medium">
                {errors.customer_name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customer_phone"
              className="text-sm font-semibold text-ink-primary mb-1.5 flex items-center justify-between"
            >
              <span>
                Số điện thoại liên hệ <span className="text-state-error-ink">*</span>
              </span>
              {isPhoneValid && (
                <span className="text-xs text-state-success-ink font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Hợp lệ
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                <Phone size={16} />
              </div>
              <input
                id="customer_phone"
                type="tel"
                maxLength={10}
                placeholder="VD: 0987654321"
                {...register('customer_phone')}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-surface-pure border rounded-[10px] text-sm font-mono tabular-nums text-ink-primary placeholder-ink-muted focus:outline-none focus:ring-2 transition-colors ${
                  errors.customer_phone
                    ? 'border-state-error-ink focus:ring-state-error-ink/20'
                    : isPhoneValid
                    ? 'border-state-success-ink focus:border-state-success-ink focus:ring-state-success-ink/20'
                    : 'border-clay focus:border-control-active-border focus:ring-focus-ring/20'
                }`}
              />
            </div>
            {errors.customer_phone && (
              <p className="text-xs text-state-error-ink mt-1 font-medium">
                {errors.customer_phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Pet Name & Species Collar Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label
              htmlFor="pet_name"
              className="block text-sm font-semibold text-ink-primary mb-1.5"
            >
              Tên bé cưng <span className="text-ink-muted font-normal">(không bắt buộc)</span>
            </label>
            <input
              id="pet_name"
              type="text"
              placeholder="VD: Mimi, Bơ, Lu, Cà Phê..."
              {...register('pet_name')}
              className="w-full px-3.5 py-2.5 bg-surface-pure border border-clay rounded-[10px] text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-control-active-border focus:ring-2 focus:ring-focus-ring/20 transition-colors"
            />
          </div>

          <div className="sm:col-span-7">
            <span className="block text-sm font-semibold text-ink-primary mb-1.5">
              Loài thú cưng <span className="text-state-error-ink">*</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {petChoices.map((item) => {
                const isSelected = petType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handlePetTypeSelect(item.type)}
                    aria-pressed={isSelected}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                      isSelected
                        ? 'bg-control-active-bg text-control-active-ink border-control-active-border'
                        : 'bg-surface-pure text-ink-primary border-clay hover:border-control-active-border hover:bg-surface-subtle/50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.pet_type && (
              <p className="text-xs text-state-error-ink mt-1 font-medium">
                {errors.pet_type.message}
              </p>
            )}
          </div>
        </div>

        {/* Pet Weight Slider & Collar Presets */}
        <div className="bg-surface-subtle/70 rounded-[12px] p-4 border border-rim">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <label htmlFor="weight_kg_input" className="text-sm font-semibold text-ink-primary">
                Cân nặng của bé
              </label>
              <span className="text-xs text-ink-secondary ml-1.5">
                (Xác định mức giá Spa &amp; Khách sạn)
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-pure border border-strong px-3 py-1 rounded-[8px]">
              <input
                id="weight_kg_input"
                type="number"
                step="0.5"
                min="0.5"
                max="60"
                value={weightInput}
                onChange={(e) => handleWeightTextChange(e.target.value)}
                onBlur={handleWeightBlur}
                className="w-14 text-center text-sm font-mono tabular-nums font-bold text-ink-slate bg-transparent focus:outline-none"
              />
              <span className="text-xs font-mono font-bold text-ink-secondary">kg</span>
            </div>
          </div>

          <div className="mb-3.5 px-0.5">
            <input
              type="range"
              aria-label="Thanh chọn cân nặng thú cưng"
              min="0.5"
              max="40"
              step="0.5"
              value={Math.min(40, weightKg)}
              onChange={(e) => handleWeightChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-rim rounded-lg appearance-none cursor-pointer accent-accent-collar focus:outline-none"
            />
            <div className="flex justify-between text-[11px] font-mono tabular-nums font-medium text-ink-secondary mt-1.5">
              <span>0.5kg</span>
              <span>10kg</span>
              <span>20kg</span>
              <span>30kg</span>
              <span>40kg+</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-ink-secondary font-medium mr-1">Chọn nhanh:</span>
            {WEIGHT_PRESETS.map((preset) => {
              const isCurrent = Math.abs(weightKg - preset.value) < 0.5;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleWeightChange(preset.value)}
                  title={preset.desc}
                  className={`px-3 py-1 rounded-full text-xs font-mono tabular-nums font-semibold transition-colors cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                    isCurrent
                      ? 'bg-accent-collar text-white border-accent-collar'
                      : 'bg-surface-pure text-ink-primary border-clay hover:border-control-active-border'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
