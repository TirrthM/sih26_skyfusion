'use client';

import { Variants } from 'framer-motion';

/**
 * Reusable Motion Variants for SkyFusion
 * Designed with UI/UX Pro Max and Motion principles:
 * - Natural spring dynamics
 * - Staggered choreography
 * - Graceful exit and entry transitions
 * - Zero layout jitter
 */

export const softSpring = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 0.8,
};

export const gentleSpring = {
  type: 'spring',
  stiffness: 180,
  damping: 22,
};

export const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0.05): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

export const floatingCard = (reducedMotion = false): Variants => ({
  initial: { y: 0 },
  animate: reducedMotion
    ? { y: 0 }
    : {
        y: [-4, 4, -4],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
});

export const floatingBadge = (reducedMotion = false, delay = 0): Variants => ({
  initial: { y: 0 },
  animate: reducedMotion
    ? { y: 0 }
    : {
        y: [-3, 3, -3],
        transition: {
          duration: 4.5,
          repeat: Infinity,
          delay,
          ease: 'easeInOut',
        },
      },
});

export const cardHoverVariants = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.008,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
  tap: {
    y: 0,
    scale: 0.99,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

export const pillButtonHover = {
  initial: { scale: 1 },
  hover: {
    scale: 1.025,
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  },
  tap: {
    scale: 0.97,
    transition: { type: 'spring', stiffness: 450, damping: 22 },
  },
};
