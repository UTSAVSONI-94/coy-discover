import React from 'react';
import { X, Heart } from 'lucide-react';

/**
 * Action Buttons for Pass (X) and Like (Heart)
 */
export default function ActionButtons({ onPass, onLike, disabled = false }) {
  return (
    <div className="flex items-center justify-center gap-6 py-4 select-none">
      {/* Pass Button */}
      <button
        type="button"
        onClick={onPass}
        disabled={disabled}
        aria-label="Pass profile"
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-[#1c2027] border border-gray-700/60 shadow-lg text-gray-400 hover:text-white hover:border-gray-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150"
      >
        <X className="w-8 h-8 transition-transform duration-150 group-hover:scale-110" />
      </button>

      {/* Like Button */}
      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        aria-label="Like profile"
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-[#1c2027] border border-[#FF5252]/40 shadow-lg text-[#FF5252] hover:bg-[#FF5252]/10 hover:border-[#FF5252] active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150"
      >
        <Heart className="w-8 h-8 fill-current transition-transform duration-150 group-hover:scale-110" />
      </button>
    </div>
  );
}
