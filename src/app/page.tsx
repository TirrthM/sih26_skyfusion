'use client';

import React, { useState } from 'react';
import { LandingNav } from '@/components/navigation/LandingNav';
import { ReconstructionWorkspace } from '@/components/landing/ReconstructionWorkspace';
import { ExamplesSection } from '@/components/landing/ExamplesSection';
import { CapabilitiesGrid } from '@/components/landing/CapabilitiesGrid';
import { PipelineDemo } from '@/components/landing/PipelineDemo';
import { WorkflowSteps } from '@/components/landing/WorkflowSteps';
import { FAQSection } from '@/components/landing/FAQSection';
import { DesignSystemPreview } from '@/components/landing/DesignSystemPreview';
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
    const el = document.getElementById('upload-panel') || document.getElementById('reconstruction');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetWorkspace = () => {
    setSelectedExample(null);
    setSettings(DEFAULT_RECONSTRUCTION_SETTINGS);
  };

  return (
    <div className="min-h-screen relative flex flex-col selection:bg-[#659AC1] selection:text-white overflow-x-hidden">
      {/* Continuous Autonomous UAV Swarm Flight Canvas Background */}
      <ContinuousDroneBackground />

      {/* Sticky Top Mission Navigation */}
      <LandingNav />

      {/* Main Single-Page Product Flow */}
      <main className="flex-1 relative z-10 space-y-4">
        {/* 1. Cinematic Hero Showcase & 2. 2-Column Reconstruction Workspace with VGGT Controls */}
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

        {/* 4. Core Capabilities */}
        <CapabilitiesGrid />

        {/* 5. Interactive 3D Pipeline */}
        <PipelineDemo />

        {/* 6. 4-Step Autonomous Workflow */}
        <WorkflowSteps />

        {/* 7. Frequently Asked Questions */}
        <FAQSection />

        {/* 8. Design System Tokens Preview */}
        <DesignSystemPreview />
      </main>

      {/* 9. Landing Footer */}
      <LandingFooter />
    </div>
  );
}
