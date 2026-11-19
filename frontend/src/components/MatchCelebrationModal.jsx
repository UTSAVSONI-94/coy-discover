import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Compass, ArrowRight } from 'lucide-react';

/**
 * MatchCelebrationModal Component
 * Tasteful celebratory overlay displayed exclusively when a mutual match occurs.
 */
export default function MatchCelebrationModal({ match, onClose, onViewMatches }) {
  if (!match) return null;

  const { profile } = match;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
        {/* Animated Card Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-[#161a22] border border-gray-700/80 rounded-3xl p-6 text-center shadow-2xl overflow-hidden"
        >
          {/* Subtle glow effect behind heading */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FF4458]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
            className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#FF655B] to-[#FF4458] flex items-center justify-center shadow-lg shadow-red-500/30 mb-4"
          >
            <Heart className="w-7 h-7 text-white fill-white" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
            It's a Match!
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            You and <span className="font-semibold text-white">{profile.name}</span> liked each other.
          </p>

          {/* Matched Profile Photo */}
          <div className="relative mx-auto w-36 h-48 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 mb-6 bg-gray-900">
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-sm font-bold text-white drop-shadow">
                {profile.name}, {profile.age}
              </span>
            </div>
          </div>

          {/* Privacy Promise Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400 mb-6">
            <Sparkles className="w-3 h-3" /> Mutual Match Confirmed
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onViewMatches}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#FF655B] to-[#FF4458] hover:from-[#ff5447] hover:to-[#ff3349] text-white shadow-lg shadow-red-500/25 transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>View Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Keep Swiping</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
