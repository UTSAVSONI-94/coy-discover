import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import ProfileCard from './ProfileCard';

const SWIPE_THRESHOLD = 85;
const VELOCITY_THRESHOLD = 350;

/**
 * SwipeableCard Component
 * High-performance Framer Motion card with instant physics-based fly-out animations.
 */
export default function SwipeableCard({ profile, onSwipe, swipeTrigger }) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const swipingRef = useRef(false);

  // Dynamic rotation proportional to horizontal drag distance
  const rotate = useTransform(x, [-250, 250], [-18, 18]);

  // Opacity for LIKE badge (visible when dragged right)
  const likeOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);

  // Opacity for PASS badge (visible when dragged left)
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);

  // Handle external button trigger (Desktop Like/Pass buttons)
  useEffect(() => {
    if (!swipeTrigger || swipingRef.current) return;
    swipingRef.current = true;

    const targetX = swipeTrigger === 'LIKE' ? 550 : -550;
    const targetRotate = swipeTrigger === 'LIKE' ? 18 : -18;

    controls.start({
      x: targetX,
      opacity: 0,
      rotate: targetRotate,
      transition: { duration: 0.2, ease: 'easeIn' },
    }).then(() => {
      onSwipe(swipeTrigger);
      swipingRef.current = false;
    });
  }, [swipeTrigger, controls, onSwipe]);

  // Handle touch / mouse drag release
  const handleDragEnd = async (event, info) => {
    if (swipingRef.current) return;

    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    if (offsetX > SWIPE_THRESHOLD || velocityX > VELOCITY_THRESHOLD) {
      swipingRef.current = true;
      await controls.start({
        x: 550,
        opacity: 0,
        rotate: 18,
        transition: { duration: 0.2, ease: 'easeIn' },
      });
      onSwipe('LIKE');
      swipingRef.current = false;
    } else if (offsetX < -SWIPE_THRESHOLD || velocityX < -VELOCITY_THRESHOLD) {
      swipingRef.current = true;
      await controls.start({
        x: -550,
        opacity: 0,
        rotate: -18,
        transition: { duration: 0.2, ease: 'easeIn' },
      });
      onSwipe('PASS');
      swipingRef.current = false;
    } else {
      // Smooth spring back to center for incomplete drags
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: 'spring', stiffness: 500, damping: 28 },
      });
    }
  };

  return (
    <motion.div
      animate={controls}
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.75}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="relative w-full cursor-grab active:cursor-grabbing touch-none select-none z-20"
    >
      {/* LIKE Badge (Top-Left) */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 left-6 z-30 pointer-events-none px-4 py-1.5 border-4 border-emerald-400 rounded-xl -rotate-12 bg-emerald-950/70 backdrop-blur-md shadow-lg"
      >
        <span className="text-xl sm:text-2xl font-black tracking-widest text-emerald-400 uppercase">
          LIKE
        </span>
      </motion.div>

      {/* PASS Badge (Top-Right) */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-6 right-6 z-30 pointer-events-none px-4 py-1.5 border-4 border-[#FF5252] rounded-xl rotate-12 bg-red-950/70 backdrop-blur-md shadow-lg"
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
