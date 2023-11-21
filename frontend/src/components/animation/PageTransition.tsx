"use client"
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  keyProp: string;
}

const pageTransitionVariants = {
  initial: { opacity: 0 }, // Start with zero opacity
  animate: {
    opacity: 1, // Fade in to full opacity
    transition: { duration: 1 }
  },
  exit: {
    opacity: 0, // Fade out to zero opacity
    transition: { duration: 1 }
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, keyProp }) => {
  return (
    <AnimatePresence>
      <motion.main
        key={keyProp}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 mb-20 px-2 md:px-0"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
};

export default PageTransition;
