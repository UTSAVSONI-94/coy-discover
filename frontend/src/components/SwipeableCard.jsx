import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import ProfileCard from './ProfileCard';

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 400;

/**
 * SwipeableCard Component
 * Wraps ProfileCard in Framer Motion drag physics, rotation, and LIKE/PASS badges.
 */
export default function SwipeableCard({ profile, onSwipe, disabled = false }) {
  const x = useMotionValue(0);

  // Dynamic rotation proportional to horizontal drag distance
  const rotate = useTransform(x, [-250, 250], [-18, 18]);

  // Opacity for LIKE badge (visible when dragged right)
  const likeOpacity = useTransform(x, [25, SWIPE_THRESHOLD], [0, 1]);

  // Opacity for PASS badge (visible when dragged left)
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, -25], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (disabled) return;

    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    if (offsetX > SWIPE_THRESHOLD || velocityX > VELOCITY_THRESHOLD) {
      // Swiped Right -> LIKE
      onSwipe('LIKE');
    } else if (offsetX < -SWIPE_THRESHOLD || velocityX < -VELOCITY_THRESHOLD) {
      // Swiped Left -> PASS
      onSwipe('PASS');
    }
  };

  return (
    <motion.div
      style={{ x, rotate }}
      drag={disabled ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.75}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="relative w-full cursor-grab active:cursor-grabbing touch-none select-none"
    >
      {/* LIKE Badge (Top-Left) */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 left-6 z-30 pointer-events-none px-4 py-1.5 border-4 border-emerald-400 rounded-xl -rotate-12 bg-emerald-950/60 backdrop-blur-md shadow-lg"
      >
        <span className="text-xl sm:text-2xl font-black tracking-widest text-emerald-400 uppercase">
          LIKE
        </span>
      </motion.div>

      {/* PASS Badge (Top-Right) */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-6 right-6 z-30 pointer-events-none px-4 py-1.5 border-4 border-[#FF5252] rounded-xl rotate-12 bg-red-950/60 backdrop-blur-md shadow-lg"
      >
        <span className="text-xl sm:text-2xl font-black tracking-widest text-[#FF5252] uppercase">
          PASS
        </span>
      </motion.div>

      {/* Base Profile Card */}
      <ProfileCard profile={profile} />
    </motion.div>
  );
}

