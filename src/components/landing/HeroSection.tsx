import React from 'react';
import { ArrowUpRight, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { staggerContainer, staggerItem } from '@/utils/motionVariants';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Optimized Atmospheric Radial Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#659AC1]/25 via-[#93B8D3]/15 to-transparent dark:from-[#31514F]/25 dark:via-[#37699F]/10 dark:to-transparent rounded-full pointer-events-none -z-10 blur-xl" />

      {/* Hero Header & Narrative */}
      <motion.div
        variants={staggerContainer(0.1, 0.04)}
        initial="hidden"
        animate="visible"
        className="text-center max-w-3xl mx-auto space-y-5"
      >
        {/* Confident Headline */}
        <motion.h1
          variants={staggerItem}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0B100D] dark:text-[#F1F8F9] leading-[1.08]"
        >
          Transform Drone Imagery{' '}
          <span className="bg-gradient-to-r from-[#204C79] via-[#37699F] to-[#2D5A3C] dark:from-[#93B8D3] dark:via-[#659AC1] dark:to-[#8EBE9D] bg-clip-text text-transparent">
            Into an Explorable 3D World.
          </span>
        </motion.h1>

        {/* Editorial Subtitle */}
        <motion.p
          variants={staggerItem}
          className="text-base sm:text-lg text-[#1E293B] dark:text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto font-normal"
        >
          Turn overlapping UAV imagery into an interactive 3D reconstruction through camera calibration, depth estimation, multi-view pose recovery, and robust point-cloud fusion.
        </motion.p>

        {/* Primary and Secondary Pill CTAs */}
        <motion.div
          variants={staggerItem}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-1"
        >
          <a
            href="#reconstruction"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('reconstruction')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Button
              variant="dark-pill"
              size="lg"
              iconRight={<ArrowUpRight className="w-4 h-4" />}
            >
              Head to Workspace
            </Button>
          </a>

          <a
            href="#examples"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Button
              variant="secondary"
              size="lg"
              iconLeft={<Box className="w-4 h-4 text-[#37699F] dark:text-[#659AC1]" />}
            >
              Explore Examples
            </Button>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

