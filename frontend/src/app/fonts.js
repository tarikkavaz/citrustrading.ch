import { Inter_Tight, Playfair_Display } from "next/font/google";

export const intertight = Inter_Tight({
  weight: ['100', '400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const playfair = Playfair_Display({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})