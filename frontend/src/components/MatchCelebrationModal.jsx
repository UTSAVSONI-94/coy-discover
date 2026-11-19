import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Compass, ArrowRight } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export default function MatchCelebrationModal({ match, onClose, onViewMatches }) {
  if (!match) return null;

  const { profile } = match;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm bg-[#161a22] border border-gray-800 rounded-3xl p-6 text-center shadow-2xl overflow-hidden"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-[#FF655B] to-[#FF4458] flex items-center justify-center shadow-lg shadow-red-500/25 mb-3">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
            It's a Match!
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            You and <span className="font-semibold text-white">{profile.name}</span> liked each other.
          </p>

          <div className="relative mx-auto w-36 h-48 rounded-2xl overflow-hidden shadow-lg border border-gray-700/60 mb-6 bg-gray-900">
            <img
              src={profile.photo}
              alt={profile.name}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-sm font-semibold text-white">
                {profile.name}, {profile.age}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={onViewMatches}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-[#FF655B] to-[#FF4458] hover:opacity-95 text-white shadow-md shadow-red-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <span>View Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition flex items-center justify-center gap-1.5"
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
