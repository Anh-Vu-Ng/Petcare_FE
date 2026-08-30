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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Đã xảy ra sự cố tải trang</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          Hệ thống gặp trục trặc khi kết nối hoặc hiển thị dữ liệu. Vui lòng nhấn nút thử lại bên dưới.
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 active:scale-95 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-500/20"
        >
          <RotateCcw size={16} />
          <span>Tải lại trang</span>
        </button>
      </div>
    </div>
  );
}
