import React from 'react';

/**
 * Placeholder Home Tab
 * The Coy assignment explicitly requires Home to remain a blank placeholder.
 */
export default function HomePlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
      <div className="w-12 h-12 rounded-full border border-dashed border-gray-800 flex items-center justify-center mb-3 text-gray-600">
        •
      </div>
      <p className="text-sm font-medium text-gray-400">Home Tab Placeholder</p>
      <p className="text-xs text-gray-600 mt-1 max-w-xs">
        Per the assignment instructions, this section remains blank while functionality lives in the Discover tab.
      </p>
    </div>
  );
}
