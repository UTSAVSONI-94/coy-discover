import React, { useState } from 'react';
import DiscoverPage from './pages/DiscoverPage';
import HomePlaceholder from './components/HomePlaceholder';
import Navigation from './components/Navigation';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover'); // 'home' | 'discover'

  return (
    <div className="min-h-screen bg-[#0e1015] text-white flex flex-col justify-between">
      {/* Active Tab View */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'home' ? (
          <div className="flex-1 flex flex-col w-full max-w-md mx-auto min-h-screen">
            <header className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-gray-800/60 bg-[#0f1115]/80 backdrop-blur-md">
              <span className="font-bold text-lg tracking-tight text-gray-300">Coy</span>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Home</span>
            </header>
            <HomePlaceholder />
          </div>
        ) : (
          <DiscoverPage />
        )}
      </div>

      {/* Primary Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />
    </div>
  );
}
