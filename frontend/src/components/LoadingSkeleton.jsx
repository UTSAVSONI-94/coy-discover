import React from 'react';

/**
 * Loading Skeleton mimicking the Profile Card layout
 */
export default function LoadingSkeleton() {
  return (
    <div className="w-full aspect-[3/4.2] sm:aspect-[3/4.4] max-h-[580px] bg-[#191d24] rounded-3xl overflow-hidden border border-gray-800/80 p-6 flex flex-col justify-end space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-2/3 bg-gray-800/80 rounded-lg" />
        <div className="h-4 w-1/3 bg-gray-800/60 rounded-md" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-gray-800/60 rounded" />
        <div className="h-3 w-4/5 bg-gray-800/60 rounded" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-20 bg-gray-800/70 rounded-full" />
        <div className="h-6 w-24 bg-gray-800/70 rounded-full" />
        <div className="h-6 w-16 bg-gray-800/70 rounded-full" />
      </div>
    </div>
  );
}
