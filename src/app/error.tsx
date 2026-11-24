'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error Caught by Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-ground p-4">
      <div className="max-w-md w-full bg-surface-card rounded-[14px] p-6 sm:p-8 border border-rim text-center">
        <div className="w-14 h-14 bg-state-error-soft text-state-error-ink rounded-[12px] flex items-center justify-center mx-auto mb-4 border border-state-error-border">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-ink-primary mb-2">
          Đã xảy ra sự cố tải trang
        </h2>
        <p className="text-xs sm:text-sm text-ink-secondary mb-6 leading-relaxed">
          Hệ thống gặp trục trặc khi kết nối hoặc hiển thị dữ liệu. Vui lòng nhấn nút tải lại bên dưới.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="w-full py-2.5 px-4 bg-shell-bg hover:bg-shell-surface text-shell-ink-bright font-semibold text-sm rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw size={15} />
          <span>Tải lại trang</span>
        </button>
      </div>
    </div>
  );
}
