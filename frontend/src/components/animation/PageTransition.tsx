"use client"
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  keyProp: string;
}

const pageTransitionVariants = {
  initial: { 
    opacity: 0
  },
  enter: {
    opacity: 1,
    transition: {duration: 0.5}
  },
  exit: {
    opacity: 0,
    transition: {duration: 0.5}
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, keyProp }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={keyProp}
        variants={pageTransitionVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="flex-1 px-2 mb-20 md:px-0"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
};

export default PageTransition;
