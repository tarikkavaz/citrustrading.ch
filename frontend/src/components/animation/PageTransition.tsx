"use client"
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { PageTransitionProps } from "@/utils/types";

const pageTransitionVariants = {
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: 0.5
    }
  },
  out: {
    opacity: 0,
    scale: 1,
    y: 40,
    transition: {
      duration: 0.75
    }
  }
};



const PageTransition: React.FC<PageTransitionProps> = ({ children, keyProp }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        // key={keyProp}
        // variants={pageTransitionVariants}
        // animate="in"
        // initial="out"
        // exit="out"
        className="flex-1 px-2 mb-20 md:px-0"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
};

export default PageTransition;
