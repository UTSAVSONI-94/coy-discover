import React from 'react';
import { Compass, RefreshCw } from 'lucide-react';

export default function EmptyFeedState({ onRefresh }) {
  return (
    <div className="w-full aspect-[3/4.2] sm:aspect-[3/4.4] max-h-[580px] bg-[#181c22] rounded-3xl border border-gray-800 p-8 flex flex-col items-center justify-center text-center select-none shadow-xl">
      <div className="w-14 h-14 rounded-full bg-[#1f242c] border border-gray-800 flex items-center justify-center text-gray-400 mb-4">
        <Compass className="w-7 h-7 text-gray-400" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">You're all caught up</h3>
      <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-6">
        No more new profiles in your area right now. Check back later or refresh your feed.
      </p>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1f242c] hover:bg-gray-800 border border-gray-700 text-xs font-medium text-gray-200 transition active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      )}
    </div>
  );
}
