import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Heart, MapPin, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

/**
 * MatchesView Component
 * Displays mutual matches retrieved from GET /api/matches.
 */
export default function MatchesView() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMatches();
      setMatches(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-8 h-8 border-2 border-[#FF5252] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-medium">Loading your matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-white">Could not load matches</p>
        <p className="text-xs text-gray-400 max-w-xs">{error}</p>
        <button
          onClick={fetchMatches}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 select-none">
        <div className="w-16 h-16 rounded-full bg-[#1e232b] border border-gray-800 flex items-center justify-center text-[#FF5252] shadow-inner mb-2">
          <Heart className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white">No matches yet</h3>
        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
          When you like someone and they like you back, your mutual match will appear here!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 pb-20 sm:pb-6">
      <div className="flex items-center justify-between pb-2 border-b border-gray-800/80">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Mutual Matches</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF5252]/15 text-[#FF5252] font-semibold border border-[#FF5252]/30">
            {matches.length}
          </span>
        </div>
        <button
          onClick={fetchMatches}
          title="Refresh matches"
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {matches.map((item) => {
          const profile = item.profile;
          return (
            <div
              key={item.matchId}
              className="bg-[#181c22] border border-gray-800/90 rounded-2xl overflow-hidden shadow-lg p-3 flex gap-3.5 items-center hover:border-gray-700 transition-colors"
            >
              {/* Photo Thumbnail */}
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-gray-900 shrink-0 border border-gray-800">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">
                    {profile.name}, {profile.age}
                  </h4>
                </div>

                {profile.location && (
                  <p className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
                    <MapPin className="w-3 h-3 text-[#FF5252] shrink-0" />
                    <span className="truncate">{profile.location}</span>
                  </p>
                )}

                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Sparkles className="w-2.5 h-2.5" /> Mutual Match
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

