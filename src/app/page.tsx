'use client';

import React, { useState } from 'react';
import { LandingNav } from '@/components/navigation/LandingNav';
import { ReconstructionWorkspace } from '@/components/landing/ReconstructionWorkspace';
import { ExamplesSection } from '@/components/landing/ExamplesSection';
import { CapabilitiesGrid } from '@/components/landing/CapabilitiesGrid';
import { PipelineDemo } from '@/components/landing/PipelineDemo';
import { WorkflowSteps } from '@/components/landing/WorkflowSteps';
import { FAQSection } from '@/components/landing/FAQSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ContinuousDroneBackground } from '@/components/canvas/ContinuousDroneBackground';
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
    <div className="min-h-screen relative flex flex-col selection:bg-sf-cyan selection:text-slate-950 overflow-x-hidden">
      {/* Continuous Autonomous UAV Swarm Flight Canvas Background */}
      <ContinuousDroneBackground />

      {/* Sticky Top Mission Navigation */}
      <LandingNav />

      {/* Main Single-Page Product Flow */}
      <main className="flex-1 relative z-10">
        {/* 1. Tagline & Real Reconstruction Workspace with VGGT Controls */}
        <ReconstructionWorkspace
          settings={settings}
          onSettingsChange={setSettings}
          selectedExample={selectedExample}
          onResetWorkspace={handleResetWorkspace}
        />

        {/* 2. Interactive Examples Section (Click any row to load an example) */}
        <ExamplesSection
          selectedExampleId={selectedExample?.id || null}
          onSelectExample={handleSelectExample}
        />

        {/* 3. Core Capabilities */}
        <CapabilitiesGrid />

        {/* 4. Interactive 3D Pipeline */}
        <PipelineDemo />

        {/* 5. 4-Step Autonomous Workflow */}
        <WorkflowSteps />

        {/* 6. Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Tactical Footer */}
      <LandingFooter />
    </div>
  );
}
