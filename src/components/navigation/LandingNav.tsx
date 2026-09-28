'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

export const LandingNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [scrolled, setScrolled] = useState(false);
  const isScrollingProgrammaticallyRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sections = ['reconstruction', 'examples', 'capabilities', 'pipeline', 'workflow', 'faq'];

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // If user clicked a nav tab, don't let scroll-spy cycle through intermediate sections
      if (isScrollingProgrammaticallyRef.current) return;

      if (window.scrollY < 220) {
        setActiveSection('top');
        return;
      }

      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    setActiveSection(id);

    // Lock scroll-spy while smooth scrolling to target section
    isScrollingProgrammaticallyRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Release lock after smooth scroll finishes
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingProgrammaticallyRef.current = false;
    }, 850);
  };

  const navLinks = [
    { label: 'Home', id: 'top' },
    { label: 'Workspace', id: 'reconstruction' },
    { label: 'Examples', id: 'examples' },
    { label: 'Capabilities', id: 'capabilities' },
    { label: '3D Pipeline', id: 'pipeline' },
    { label: 'Workflow', id: 'workflow' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <header className="sticky top-3 sm:top-5 z-50 w-full px-3 sm:px-6 md:px-8 pointer-events-none transition-all duration-300">
      <div
        className={`max-w-5xl mx-auto pointer-events-auto flex items-center justify-between px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#142026]/95 backdrop-blur-md border border-slate-300 dark:border-slate-700/80 shadow-aerial dark:shadow-aerial-dark'
            : 'bg-white/90 dark:bg-[#142026]/85 backdrop-blur-sm border border-slate-300/80 dark:border-slate-700/60 shadow-sm'
        }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#reconstruction"
            onClick={(e) => scrollToSection(e, 'reconstruction')}
            className="flex items-center gap-2.5 group cursor-pointer outline-none focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B100D] dark:bg-[#F1F8F9] text-[#F1F8F9] dark:text-[#0B100D] flex items-center justify-center font-display font-black text-xs tracking-tight shadow-xs group-hover:scale-105 transition-transform duration-200">
              SF
            </div>
            <div className="flex items-center">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-950 dark:text-white">
                Sky<span className="text-[#37699F] dark:text-[#93B8D3]">Fusion</span>
              </span>
            </div>
          </a>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-[#0D1518]/90 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700/80">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`relative py-1.5 px-3.5 rounded-full border text-xs font-mono transition-colors duration-150 cursor-pointer outline-none focus:outline-none select-none ${
                  isActive
                    ? 'text-slate-950 dark:text-white font-bold bg-white dark:bg-[#1E2F38] shadow-xs border-slate-300/80 dark:border-[#659AC1]/50'
                    : 'border-transparent text-slate-700 hover:text-slate-950 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#1A2A32]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Controls: Theme Switcher */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#142026] text-slate-800 dark:text-slate-200 outline-none focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto max-w-5xl mx-auto mt-2 p-4 rounded-3xl bg-white dark:bg-[#142026]/95 backdrop-blur-md border border-slate-300 dark:border-slate-700/80 shadow-aerial-lg dark:shadow-aerial-dark"
          >
            <div className="flex flex-col gap-1.5 text-xs font-mono font-medium">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-[#1A2A32] text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-between outline-none focus:outline-none"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
