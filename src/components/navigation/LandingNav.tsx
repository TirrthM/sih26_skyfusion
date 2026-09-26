'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';

export const LandingNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('reconstruction');

  // Track active section on scroll for subtle indicator
  useEffect(() => {
    const sections = ['reconstruction', 'capabilities', 'pipeline', 'workflow', 'faq'];

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
    { label: 'Reconstruction', id: 'reconstruction' },
    { label: 'Capabilities', id: 'capabilities' },
    { label: '3D Pipeline', id: 'pipeline' },
    { label: 'Workflow', id: 'workflow' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <header className="sticky top-4 sm:top-6 z-50 w-full px-4 sm:px-8 pointer-events-none transition-all">
      <div className="max-w-6xl mx-auto pointer-events-auto flex items-center justify-between px-5 sm:px-7 py-3 rounded-full bg-slate-950/60 dark:bg-slate-950/70 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#reconstruction"
            onClick={(e) => scrollToSection(e, 'reconstruction')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center font-display font-black text-xs shadow-md group-hover:scale-105 transition-transform">
              SF
            </div>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white">
              Sky<span className="text-emerald-400">Fusion</span>
            </span>
          </a>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-sans font-medium tracking-wide text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`transition-all relative py-1 hover:text-white ${
                  isActive
                    ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full'
                    : 'text-slate-300'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Controls: Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-full border border-white/20 bg-white/10 text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="pointer-events-auto max-w-6xl mx-auto mt-2 p-4 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-white/20 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2 text-sm font-sans font-medium">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="p-3 hover:bg-white/10 rounded-xl text-slate-200 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
