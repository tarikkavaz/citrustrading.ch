'use client';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 1 }
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 1 }
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
  keyProp: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, keyProp }) => {
  return (
    <AnimatePresence mode="wait">
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
