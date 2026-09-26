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
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 md:px-8 pointer-events-none transition-all">
      <div className="max-w-7xl mx-auto pointer-events-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full bg-white/95 dark:bg-sf-bg-dark/95 backdrop-blur-md border-2 border-slate-950 dark:border-sf-border-dark shadow-tactile-light dark:shadow-tactile-dark transition-colors">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#reconstruction"
            onClick={(e) => scrollToSection(e, 'reconstruction')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-sf-cyan text-slate-950 border-2 border-slate-950 flex items-center justify-center font-display font-black text-sm shadow-tactile-sm-light group-hover:scale-105 transition-transform">
              SF
            </div>
            <div className="flex items-center">
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Sky<span className="text-sf-cyan">Fusion</span>
              </span>
            </div>
          </a>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-medium tracking-wide text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`transition-colors py-1 px-2.5 rounded-full ${
                  isActive
                    ? 'text-slate-950 dark:text-sf-cyan font-bold bg-slate-100 dark:bg-sf-surface-dark border border-slate-950 dark:border-sf-cyan/40'
                    : 'hover:text-slate-950 dark:hover:text-sf-cyan'
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
            className="lg:hidden p-1.5 rounded-full border-2 border-slate-950 dark:border-sf-border-dark bg-slate-100 dark:bg-sf-surface-dark text-slate-900 dark:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="pointer-events-auto max-w-7xl mx-auto mt-2 p-4 rounded-2xl bg-white/98 dark:bg-sf-surface-dark/98 backdrop-blur-md border-2 border-slate-950 dark:border-sf-border-dark shadow-tactile-lg-light dark:shadow-tactile-dark animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2 text-sm font-mono font-semibold uppercase tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
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
