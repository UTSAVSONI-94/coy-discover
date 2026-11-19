import React from 'react';

export default function HomePlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
      <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center mb-3 text-gray-600 text-xs">
        —
      </div>
      <p className="text-sm font-medium text-gray-400">Home</p>
      <p className="text-xs text-gray-600 mt-1 max-w-xs">
        Head over to the Discover tab to start browsing profiles.
      </p>
    </div>
  );
}
