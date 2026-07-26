export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
  transition: { duration: 0.28, ease: "easeOut" }
} as const;

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
} as const;

export const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: "easeOut" }
  }
} as const;
