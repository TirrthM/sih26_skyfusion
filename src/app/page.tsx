'use client';

import React, { useState } from 'react';
import { LandingNav } from '@/components/navigation/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { ReconstructionWorkspace } from '@/components/landing/ReconstructionWorkspace';
import { ExamplesSection } from '@/components/landing/ExamplesSection';
import { CapabilitiesGrid } from '@/components/landing/CapabilitiesGrid';
import { PipelineDemo } from '@/components/landing/PipelineDemo';
import { WorkflowSteps } from '@/components/landing/WorkflowSteps';
import { FAQSection } from '@/components/landing/FAQSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  ReconstructionSettings,
  DEFAULT_RECONSTRUCTION_SETTINGS,
  ReconstructionExample,
} from '@/services/examplesData';

export default function SingleHomePage() {
  const [settings, setSettings] = useState<ReconstructionSettings>(DEFAULT_RECONSTRUCTION_SETTINGS);
  const [selectedExample, setSelectedExample] = useState<ReconstructionExample | null>(null);

  const handleSelectExample = (example: ReconstructionExample) => {
    setSelectedExample(example);
    setSettings({
      samplingFps: example.samplingFps,
      confidenceThreshold: example.confidenceThreshold,
      maxPoints: example.maxPoints,
      filterBlackBackground: example.filterBlackBackground,
      filterWhiteBackground: example.filterWhiteBackground,
      showCamera: example.showCamera,
      filterSky: example.filterSky,
    });

    // Smoothly focus / scroll to reconstruction workspace so user sees 3D model
    const el = document.getElementById('reconstruction');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetWorkspace = () => {
    setSelectedExample(null);
    setSettings(DEFAULT_RECONSTRUCTION_SETTINGS);
  };

  return (
    <div className="min-h-screen bg-sf-canvas-light dark:bg-sf-canvas-dark bg-aerial-canvas-light dark:bg-aerial-canvas-dark bg-aerial-grid flex flex-col selection:bg-[#93B8D3]/30 selection:text-[#0B100D] transition-colors duration-300">
      {/* Sticky Top Mission Navigation */}
      <LandingNav />

      {/* Main Single-Page Product Flow */}
      <main className="flex-1">
        {/* 1. Cinematic Hero Section with 3D Spatial Scene */}
        <HeroSection />

        {/* 2. Tagline & Real Reconstruction Workspace */}
        <ReconstructionWorkspace
          settings={settings}
          onSettingsChange={setSettings}
          selectedExample={selectedExample}
          onResetWorkspace={handleResetWorkspace}
        />

        {/* 3. Interactive Examples Section (Click any row to load an example) */}
        <ExamplesSection
          selectedExampleId={selectedExample?.id || null}
          onSelectExample={handleSelectExample}
        />

        {/* 4. Core Aerospace Capabilities */}
        <CapabilitiesGrid />

        {/* 5. Interactive 3D Pipeline */}
        <PipelineDemo />

        {/* 6. 4-Step Autonomous Workflow */}
        <WorkflowSteps />

        {/* 7. Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Airy Minimal Footer */}
      <LandingFooter />
    </div>
  );
}
