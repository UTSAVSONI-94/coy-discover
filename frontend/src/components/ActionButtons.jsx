import React from 'react';
import { X, Heart } from 'lucide-react';

export default function ActionButtons({ onPass, onLike, disabled = false }) {
  return (
    <div className="flex items-center justify-center gap-6 py-4 select-none">
      <button
        type="button"
        onClick={onPass}
        disabled={disabled}
        aria-label="Pass"
        className="flex items-center justify-center w-16 h-16 rounded-full bg-[#1c2027] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 active:scale-95 disabled:opacity-40 transition shadow-lg"
      >
        <X className="w-7 h-7" />
      </button>

      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        aria-label="Like"
        className="flex items-center justify-center w-16 h-16 rounded-full bg-[#1c2027] border border-[#FF5252]/30 text-[#FF5252] hover:bg-[#FF5252]/10 hover:border-[#FF5252] active:scale-95 disabled:opacity-40 transition shadow-lg"
      >
        <Heart className="w-7 h-7 fill-current" />
      </button>
    </div>
  );
}
