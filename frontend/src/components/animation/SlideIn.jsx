'use client'

import { createContext, useContext } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const SlideInStaggerContext = createContext(false)

const viewport = { once: true, margin: '0px 0px -200px' }

export function SlideIn(props) {
  let shouldReduceMotion = useReducedMotion()
  let isInStaggerGroup = useContext(SlideInStaggerContext)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      {...(isInStaggerGroup
        ? {}
        : {
          initial: 'hidden',
          whileInView: 'visible',
          viewport,
        })}
      {...props}
    />
  )
}

export function SlideInStagger({ faster = false, ...props }) {
  return (
    <SlideInStaggerContext.Provider value={true}>
      <motion.div
        initial={{ x: "50vw" }}
        animate={{ x: 0 }}
        transition={{ duration: 1, origin: 1 }}
        // transition={{ staggerChildren: faster ? 0.14 : 0.28 }}
        {...props}
      />
    </SlideInStaggerContext.Provider>
  )
}
