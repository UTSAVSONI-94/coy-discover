import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import ProfileCard from '../components/ProfileCard';
import ActionButtons from '../components/ActionButtons';
import MatchesView from '../components/MatchesView';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyFeedState from '../components/EmptyFeedState';
import ErrorState from '../components/ErrorState';
import { Sparkles, Compass, Heart } from 'lucide-react';

/**
 * Discover Page
 * Houses the primary Profile Discovery feed and Matches sub-view.
 */
export default function DiscoverPage() {
  const [activeSection, setActiveSection] = useState('discover'); // 'discover' | 'matches'
  const [feed, setFeed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  // Load feed and initial match count
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [feedRes, matchesRes] = await Promise.all([
        api.getFeed(),
        api.getMatches(),
      ]);

      setFeed(feedRes.data || []);
      setCurrentIndex(0);
      setMatchCount(matchesRes.count || (matchesRes.data ? matchesRes.data.length : 0));
    } catch (err) {
      setError(err.message || 'Unable to connect to Coy server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentProfile = feed[currentIndex];
  const hasProfilesLeft = currentIndex < feed.length;

  // Handle Swipe Actions (Button click)
  const handleSwipeAction = async (action) => {
    if (!currentProfile || swiping) return;

    try {
      setSwiping(true);
      const res = await api.swipe(currentProfile.id, action);

      // If action created a mutual match, update match count
      if (res.isMatch) {
        setMatchCount((prev) => prev + 1);
      }

      // Advance to next card
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to record swipe:', err);
    } finally {
      setSwiping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto min-h-screen pb-16 sm:pb-0">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-gray-800/60 bg-[#0f1115]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF655B] to-[#FF4458] flex items-center justify-center shadow-md shadow-red-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Coy</span>
        </div>

        {/* View Switch: Discover vs Matches */}
        <div className="flex items-center bg-[#191d24] p-1 rounded-full border border-gray-800">
          <button
            type="button"
            onClick={() => setActiveSection('discover')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeSection === 'discover'
                ? 'bg-[#FF5252] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Discover
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('matches')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeSection === 'matches'
                ? 'bg-[#FF5252] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Matches
            {matchCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-white text-[#FF5252] text-[10px] font-bold rounded-full">
                {matchCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 justify-between">
        {activeSection === 'matches' ? (
          <MatchesView />
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            {/* Card Area */}
            <div className="flex-1 flex items-center justify-center my-auto">
              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <ErrorState message={error} onRetry={loadData} />
              ) : !hasProfilesLeft ? (
                <EmptyFeedState onRefresh={loadData} />
              ) : (
                <ProfileCard profile={currentProfile} />
              )}
            </div>

            {/* Bottom Actions Area */}
            {hasProfilesLeft && !loading && !error && (
              <ActionButtons
                onPass={() => handleSwipeAction('PASS')}
                onLike={() => handleSwipeAction('LIKE')}
                disabled={swiping}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
