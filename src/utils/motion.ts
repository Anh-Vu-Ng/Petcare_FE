import type { Transition, Variants } from 'framer-motion';

/** Shared Stoneware & Collar Tag motion tokens for crisp transitions and collar-tag flips. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const FAST_EXIT: Transition = { duration: 0.14, ease: 'easeIn' };

export const collarFlip: Variants = {
  hidden: { opacity: 0, rotateY: -90 },
  visible: { opacity: 1, rotateY: 0, transition: { duration: 0.55, ease: EASE_OUT } },
  exit: { opacity: 0, rotateY: 90, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const fadeSwap: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.14 } },
};
