import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import SwipeableCard from '../components/SwipeableCard';
import ProfileCard from '../components/ProfileCard';
import ActionButtons from '../components/ActionButtons';
import MatchesView from '../components/MatchesView';
import MatchCelebrationModal from '../components/MatchCelebrationModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyFeedState from '../components/EmptyFeedState';
import ErrorState from '../components/ErrorState';
import { Sparkles, Compass, Heart, AlertCircle } from 'lucide-react';

/**
 * Discover Page
 * Features smooth layered deck card animations, instant fly-out responses, and mutual match celebrations.
 */
export default function DiscoverPage() {
  const [activeSection, setActiveSection] = useState('discover'); // 'discover' | 'matches'
  const [feed, setFeed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swipeError, setSwipeError] = useState(null);
  const [matchCount, setMatchCount] = useState(0);
  const [activeMatchModal, setActiveMatchModal] = useState(null);
  const [swipeTrigger, setSwipeTrigger] = useState(null); // 'LIKE' | 'PASS' | null

  // Ref lock to completely prevent simultaneous or double swipe submissions
  const isSwipingRef = useRef(false);

  // Load feed and initial match count from backend
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSwipeError(null);
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
  const nextProfile = feed[currentIndex + 1];
  const hasProfilesLeft = currentIndex < feed.length;

  /**
   * Primary Swipe Handler
   * Triggered once card animation starts flying out.
   */
  const handleCardSwiped = async (action) => {
    if (!currentProfile) return;

    const targetProfile = currentProfile;
    setSwipeTrigger(null);

    // Advance feed immediately so the next card in deck is interactive
    setCurrentIndex((prev) => prev + 1);

    // Send backend request concurrently
    try {
      const res = await api.swipe(targetProfile.id, action);

      if (res.isMatch) {
        setMatchCount((prev) => prev + 1);
        setActiveMatchModal(res.match);
      }
    } catch (err) {
      console.error('[Swipe Error]:', err);
      setSwipeError(err.message || 'Failed to sync swipe with server.');
    } finally {
      isSwipingRef.current = false;
    }
  };

  /**
   * Desktop button click handler
   */
  const handleButtonClick = (action) => {
    if (isSwipingRef.current || !currentProfile) return;
    isSwipingRef.current = true;
    setSwipeTrigger(action);
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

      {/* Ephemeral Swipe Error Banner */}
      {swipeError && (
        <div className="mx-4 mt-2 p-2.5 rounded-xl bg-red-950/80 border border-red-800/80 text-xs text-red-200 flex items-center gap-2 animate-fadeIn z-40">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="flex-1">{swipeError}</span>
          <button
            onClick={() => setSwipeError(null)}
            className="text-red-400 hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 justify-between overflow-hidden">
        {activeSection === 'matches' ? (
          <MatchesView />
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            {/* Card Deck Area */}
            <div className="relative flex-1 flex items-center justify-center my-auto min-h-[500px]">
              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <ErrorState message={error} onRetry={loadData} />
              ) : !hasProfilesLeft ? (
                <EmptyFeedState onRefresh={loadData} />
              ) : (
                <div className="relative w-full flex items-center justify-center">
                  {/* Background Next Card in Deck */}
                  {nextProfile && (
                    <div
                      key={`bg-${nextProfile.id}`}
                      className="absolute inset-0 flex items-center justify-center scale-95 translate-y-3 opacity-60 pointer-events-none transition-all duration-200 z-10"
                    >
                      <ProfileCard profile={nextProfile} />
                    </div>
                  )}

                  {/* Active Foreground Card */}
                  <div key={`active-${currentProfile.id}`} className="w-full z-20">
                    <SwipeableCard
                      profile={currentProfile}
                      swipeTrigger={swipeTrigger}
                      onSwipe={handleCardSwiped}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Desktop and Touch Action Buttons */}
            {hasProfilesLeft && !loading && !error && (
              <ActionButtons
                onPass={() => handleButtonClick('PASS')}
                onLike={() => handleButtonClick('LIKE')}
                disabled={Boolean(swipeTrigger)}
              />
            )}
          </div>
        )}
      </main>

      {/* "It's a Match!" Celebration Overlay */}
      {activeMatchModal && (
        <MatchCelebrationModal
          match={activeMatchModal}
          onClose={() => setActiveMatchModal(null)}
          onViewMatches={() => {
            setActiveMatchModal(null);
            setActiveSection('matches');
          }}
        />
      )}
    </div>
  );
}
