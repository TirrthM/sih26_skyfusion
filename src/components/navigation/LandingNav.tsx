'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const LandingNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('reconstruction');

  // Track active section on scroll
  useEffect(() => {
    const sections = ['reconstruction', 'examples', 'capabilities', 'pipeline', 'workflow', 'faq'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'ABOUT', id: 'reconstruction' },
    { label: 'RECONSTRUCTION', id: 'upload-panel' },
    { label: 'EXAMPLES', id: 'examples' },
    { label: 'CAPABILITIES', id: 'capabilities' },
    { label: 'PIPELINE', id: 'pipeline' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <header className="sticky top-4 sm:top-6 z-50 w-full px-4 sm:px-8 pointer-events-none transition-all">
      <div className="max-w-6xl mx-auto pointer-events-auto flex items-center justify-between px-5 sm:px-7 py-2.5 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.12)] transition-all">
        {/* Brand Logo with Quadcopter Drone Icon */}
        <div className="flex items-center gap-3">
          <a
            href="#reconstruction"
            onClick={(e) => scrollToSection(e, 'reconstruction')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-display font-black text-xs shadow-md group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h1.28A6 6 0 0 1 20 12.72v.28h1.28c.34-.6.98-1 1.72-1a2 2 0 1 1 0 4c-.74 0-1.38-.4-1.72-1H20v.28A6 6 0 0 1 14.28 21H13v1.28c.6.34 1 .98 1 1.72a2 2 0 1 1-4 0c0-.74.4-1.38 1-1.72V21H9.72A6 6 0 0 1 4 15.28V15H2.72c-.34.6-.98 1-1.72 1a2 2 0 1 1 0-4c.74 0 1.38.4 1.72 1H4v-.28A6 6 0 0 1 9.72 7H11V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-950 dark:text-white">
              Sky<span className="text-emerald-500 font-extrabold">Fusion</span>
            </span>
          </a>
        </div>

        {/* Center Desktop Navigation Links (Tracked Uppercase per Farmdrone style) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-sans font-bold tracking-widest text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`transition-all relative py-1 hover:text-slate-950 dark:hover:text-white ${
                  isActive
                    ? 'text-slate-950 dark:text-white font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-950 dark:after:bg-emerald-400 after:rounded-full'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Controls: Globe, Theme Toggle, Black Pill CTA Button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => {
              const el = document.getElementById('upload-panel');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-sans text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <span>TEST FLIGHT</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full border border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="pointer-events-auto max-w-6xl mx-auto mt-2 p-4 rounded-3xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200 dark:border-white/20 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2 text-xs font-sans font-bold tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="p-3 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-800 dark:text-slate-200 transition-colors uppercase"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                const el = document.getElementById('upload-panel');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-2 w-full py-3 rounded-full bg-slate-950 text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>TEST FLIGHT</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
