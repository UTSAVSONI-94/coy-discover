import React from 'react';
import { Compass, RefreshCw } from 'lucide-react';

/**
 * Empty Feed State Component
 */
export default function EmptyFeedState({ onRefresh }) {
  return (
    <div className="w-full aspect-[3/4.2] sm:aspect-[3/4.4] max-h-[580px] bg-[#181c22] rounded-3xl border border-gray-800/80 p-8 flex flex-col items-center justify-center text-center select-none shadow-xl">
      <div className="w-16 h-16 rounded-full bg-[#20252d] border border-gray-700/60 flex items-center justify-center text-gray-400 mb-4 shadow-inner">
        <Compass className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
      <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-6">
        There are no more new profiles right now. Check your Matches or refresh to check for new people.
      </p>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1f242c] hover:bg-gray-700/80 border border-gray-700 text-xs font-semibold text-gray-200 transition-colors shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Feed
        </button>
      )}
    </div>
  );
}
