import React from 'react';
import { Home, Compass } from 'lucide-react';

/**
 * App Navigation Tab Bar (Mobile-first bottom navigation, desktop responsive)
 */
export default function Navigation({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#12151a]/95 backdrop-blur-md border-t border-gray-800/80 max-w-md mx-auto sm:sticky sm:top-0 sm:bottom-auto sm:border-t-0 sm:border-b">
      <div className="flex items-center justify-around h-16 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-200 select-none ${
                isActive ? 'text-[#FF5252]' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF5252]" />
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium ${isActive ? 'text-white font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

