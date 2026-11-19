import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Error State Component with retry button
 */
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="w-full aspect-[3/4.2] sm:aspect-[3/4.4] max-h-[580px] bg-[#181c22] rounded-3xl border border-red-500/20 p-8 flex flex-col items-center justify-center text-center shadow-xl">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-white mb-1">Failed to load feed</h3>
      <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-6">
        {message || 'Something went wrong while connecting to the server.'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white transition-colors active:scale-95 shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try Again
        </button>
      )}
    </div>
  );
}
