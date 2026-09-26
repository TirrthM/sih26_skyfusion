'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileVideo,
  Play,
  RotateCcw,
  RefreshCw,
  Trash2,
  AlertCircle,
  Film,
  Camera,
  Layers,
  Sparkles,
  Sliders,
  Check,
  Clock,
  Eye,
  Sun,
  Moon,
  Filter,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Slider } from '../ui/Slider';
import { Switch } from '../ui/Switch';
import { SceneCanvas } from '../canvas/SceneCanvas';
import { Hero3DScene } from '../canvas/Hero3DScene';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  ReconstructionService,
  ReconstructionState,
  VideoInputMetadata,
  ReconstructionStatus,
  INITIAL_PROCESSING_STEPS,
} from '@/services/reconstructionService';
import {
  ReconstructionSettings,
  DEFAULT_RECONSTRUCTION_SETTINGS,
  ReconstructionExample,
} from '@/services/examplesData';

export interface ReconstructionWorkspaceProps {
  settings: ReconstructionSettings;
  onSettingsChange: (settings: ReconstructionSettings) => void;
  selectedExample: ReconstructionExample | null;
  onResetWorkspace: () => void;
}

export const ReconstructionWorkspace: React.FC<ReconstructionWorkspaceProps> = ({
  settings,
  onSettingsChange,
  selectedExample,
  onResetWorkspace,
}) => {
  const { reducedMotion, toggleReducedMotion } = useReducedMotion();

  // State Management
  const [reconstructionState, setReconstructionState] = useState<ReconstructionState>('empty');
  const [isMaximized, setIsMaximized] = useState(false);

  // Keyboard shortcut Esc to exit full screen maximize view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMaximized) {
        setIsMaximized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized]);
  const [videoMetadata, setVideoMetadata] = useState<VideoInputMetadata | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [visualUpdateNotice, setVisualUpdateNotice] = useState<string | null>(null);

  // Processing Stage Status
  const [processingStatus, setProcessingStatus] = useState<ReconstructionStatus>({
    state: 'empty',
    progressPercent: 0,
    currentStepIndex: 0,
    steps: INITIAL_PROCESSING_STEPS,
  });

  // Layer Visibility Toggles in 3D Scene
  const [showTerrain, setShowTerrain] = useState(true);
  const [showFlightPath, setShowFlightPath] = useState(true);
  const [showDrone, setShowDrone] = useState(true);

  // DOM Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelProcessingRef = useRef<(() => void) | null>(null);

  // When an example is selected from the Examples table, load it into the workspace
  useEffect(() => {
    if (selectedExample) {
      setErrorMessage(null);
      setVideoMetadata({
        fileName: selectedExample.videoFileName,
        fileSize: selectedExample.fileSize,
        fileSizeBytes: 38400000,
        duration: selectedExample.duration,
        resolution: selectedExample.resolution,
        mimeType: 'video/mp4',
        previewUrl: '',
      });
      setReconstructionState('ready');
      setVisualUpdateNotice(`Loaded example: ${selectedExample.name}`);
      setTimeout(() => setVisualUpdateNotice(null), 3000);
    }
  }, [selectedExample]);

  // Clean up Object URL on unmount or replace
  useEffect(() => {
    return () => {
      if (videoMetadata?.previewUrl) {
        URL.revokeObjectURL(videoMetadata.previewUrl);
      }
      if (cancelProcessingRef.current) {
        cancelProcessingRef.current();
      }
    };
  }, [videoMetadata]);

  // File Upload Handlers
  const handleFile = async (file: File) => {
    setErrorMessage(null);
    try {
      const metadata = await ReconstructionService.processVideoUpload(file);
      setVideoMetadata(metadata);
      setReconstructionState('uploaded');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to load video. Please select a supported MP4, MOV, AVI, or WebM file.');
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger Reconstruct
  const handleReconstruct = () => {
    if (reconstructionState === 'empty') return;

    setReconstructionState('processing');
    setErrorMessage(null);

    cancelProcessingRef.current = ReconstructionService.startDemoReconstruction(
      (status) => {
        setProcessingStatus(status);
      },
      () => {
        setReconstructionState('ready');
      }
    );
  };

  // Trigger Update Visual
  const handleUpdateVisual = () => {
    setVisualUpdateNotice('3D visual preview updated with current settings');
    setTimeout(() => setVisualUpdateNotice(null), 3000);
  };

  // Trigger Clear / Reset
  const handleClear = () => {
    if (cancelProcessingRef.current) {
      cancelProcessingRef.current();
    }
    if (videoMetadata?.previewUrl) {
      URL.revokeObjectURL(videoMetadata.previewUrl);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setVideoMetadata(null);
    setReconstructionState('empty');
    setErrorMessage(null);
    setProcessingStatus({
      state: 'empty',
      progressPercent: 0,
      currentStepIndex: 0,
      steps: INITIAL_PROCESSING_STEPS,
    });
    onSettingsChange(DEFAULT_RECONSTRUCTION_SETTINGS);
    onResetWorkspace();
  };

  // Settings Mutators
  const updateSetting = <K extends keyof ReconstructionSettings>(key: K, value: ReconstructionSettings[K]) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  // Dynamic point count mapped from settings.maxPoints (500 - 10000 K -> 1500 - 7500 3D particles)
  const calculatedPointCount = Math.min(
    7500,
    Math.max(1500, Math.round(settings.maxPoints * 0.75 + (settings.confidenceThreshold / 100) * 1500))
  );

  return (
    <section
      id="reconstruction"
      className="scroll-mt-20 pt-4 sm:pt-6 md:pt-8 pb-12 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Outer Cinematic Showcase Glass Bezel Frame matching Reference Image */}
      <div className="rounded-[28px] sm:rounded-[36px] md:rounded-[44px] border border-white/20 bg-slate-950/60 dark:bg-slate-950/70 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-6 sm:p-8 md:p-10 relative overflow-hidden space-y-8">
        {/* Top Hero Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              The Future of Smart <br className="hidden sm:inline" /> Aerial Technology
            </h1>
            <p className="text-slate-300 font-sans text-sm sm:text-base max-w-xl leading-relaxed">
              Shoot 4K videos, track subjects automatically, and enjoy smooth, stable flight with real-time 3D spatial reconstruction.
            </p>

            {/* Dual CTA Buttons & Social Proof Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#upload-panel"
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
                className="px-7 py-3 rounded-full bg-white text-slate-950 font-sans font-bold text-sm shadow-xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                Upload Video
              </a>

              <a
                href="#examples"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white font-sans font-semibold text-sm hover:bg-white/20 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                Watch Demo <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[10px]">▶</span>
              </a>

              {/* Reviews and Ratings */}
              <div className="flex items-center gap-2.5 ml-0 sm:ml-4 text-xs font-sans text-slate-300">
                <div className="flex -space-x-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 border border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                    UAV
                  </span>
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 border border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                    4K
                  </span>
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 border border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                    +12
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 font-bold">★</span>
                  <span className="font-bold text-white">4.9 K</span>
                  <span className="text-slate-400">Reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('examples');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
              aria-label="Previous Showcase"
            >
              ←
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('capabilities');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-slate-100 shadow-md transition-all font-bold"
              aria-label="Next Section"
            >
              →
            </button>
          </div>
        </div>

      {/* Main Reconstruction Workspace (2 Columns) */}
      {/* Main Reconstruction Workspace (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* Left Column: Input & Settings Panel (42% width) */}
        <div id="upload-panel" className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <Film className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Upload Flight Video
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Upload a single-pass drone video to generate a 3D reconstruction.
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  reconstructionState === 'ready'
                    ? 'emerald'
                    : reconstructionState === 'processing'
                    ? 'amber'
                    : 'cyan'
                }
                hasDot={reconstructionState !== 'empty'}
                className="whitespace-nowrap"
              >
                {reconstructionState === 'empty'
                  ? 'NO VIDEO'
                  : reconstructionState === 'uploaded'
                  ? 'READY'
                  : reconstructionState === 'processing'
                  ? 'PROCESSING'
                  : 'PREVIEW READY'}
              </Badge>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Visual Update Toast Banner */}
            {visualUpdateNotice && (
              <div className="p-2.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{visualUpdateNotice}</span>
              </div>
            )}

            {/* Empty Upload Dropzone */}
            {reconstructionState === 'empty' && (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-2xl p-6 text-center space-y-3 transition-all cursor-pointer select-none ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/30 scale-[1.01] shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                    : 'border-white/20 bg-white/5 hover:border-emerald-400/60 hover:bg-white/10'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-white shadow-inner">
                  <UploadCloud className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-display font-bold text-white">
                    Upload Video
                  </p>
                  <p className="text-xs text-slate-300 font-sans">
                    Drag & drop your flight video here, or click to browse
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white text-slate-950 shadow-md hover:bg-slate-100 transition-colors">
                    <FileVideo className="w-3.5 h-3.5 text-slate-950" />
                    Browse Files
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Supported formats: MP4, MOV, AVI, WebM
                </p>
              </div>
            )}

            {/* Uploaded Video Metadata & Preview */}
            {videoMetadata && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* Compact HTML5 Video Preview Player (or fallback for demo dataset) */}
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-black shadow-lg relative">
                  {videoMetadata.previewUrl ? (
                    <video
                      src={videoMetadata.previewUrl}
                      controls
                      className="w-full max-h-[140px] object-contain bg-black"
                    />
                  ) : (
                    <div className="h-[110px] flex flex-col items-center justify-center bg-slate-900 text-slate-300 space-y-2 p-3 text-center">
                      <Film className="w-8 h-8 text-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-white">
                        {videoMetadata.fileName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {videoMetadata.resolution} • {videoMetadata.duration} (Curated Example)
                      </span>
                    </div>
                  )}
                </div>

                {/* Video Metadata Card */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400">FILE: </span>
                    <span className="text-white font-bold truncate inline-block max-w-[120px]" title={videoMetadata.fileName}>
                      {videoMetadata.fileName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">SIZE: </span>
                    <span className="text-white font-bold">{videoMetadata.fileSize}</span>
                  </div>
                  {videoMetadata.duration && (
                    <div>
                      <span className="text-slate-400">DURATION: </span>
                      <span className="text-emerald-300 font-bold">{videoMetadata.duration}</span>
                    </div>
                  )}
                  {videoMetadata.resolution && (
                    <div>
                      <span className="text-slate-400">RES: </span>
                      <span className="text-amber-300 font-bold">{videoMetadata.resolution}</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Replace Video
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear Video
                  </button>
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
              onChange={onFileInputChange}
              className="hidden"
              id="flight-video-file-input"
            />

            {/* ============================================================ */}
            {/* REQUIRED RECONSTRUCTION SETTINGS CONTROLS (PHASE 3) */}
            {/* ============================================================ */}
            <div className="pt-3 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  Reconstruction Settings
                </span>
                <Badge variant="slate" isPill={false}>VGGT Params</Badge>
              </div>

              {/* Control 1: Video Sampling FPS */}
              <Slider
                label="Video Sampling FPS"
                min={0.5}
                max={2.0}
                step={0.1}
                value={settings.samplingFps}
                valueDisplay={`${settings.samplingFps.toFixed(1)} FPS`}
                onChange={(val) => updateSetting('samplingFps', val)}
              />

              {/* Control 2: Confidence Threshold (%) */}
              <Slider
                label="Confidence Threshold (%)"
                min={2}
                max={100}
                step={1}
                value={settings.confidenceThreshold}
                valueDisplay={`${settings.confidenceThreshold}%`}
                onChange={(val) => updateSetting('confidenceThreshold', val)}
              />

              {/* Control 3: Max Points (K points) */}
              <Slider
                label="Max Points (K points)"
                min={500}
                max={10000}
                step={250}
                value={settings.maxPoints}
                valueDisplay={`${settings.maxPoints}K`}
                onChange={(val) => updateSetting('maxPoints', val)}
              />

              {/* Controls 4, 5, 6, 7: Switches Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                {/* Control 4: Show Camera */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Switch
                    label="Show Camera"
                    checked={settings.showCamera}
                    onChange={(val) => updateSetting('showCamera', val)}
                  />
                </div>

                {/* Control 5: Filter Sky */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Switch
                    label="Filter Sky"
                    checked={settings.filterSky}
                    onChange={(val) => updateSetting('filterSky', val)}
                  />
                </div>

                {/* Control 6: Filter Black Background */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Switch
                    label="Filter Black BG"
                    checked={settings.filterBlackBackground}
                    onChange={(val) => updateSetting('filterBlackBackground', val)}
                  />
                </div>

                {/* Control 7: Filter White Background */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Switch
                    label="Filter White BG"
                    checked={settings.filterWhiteBackground}
                    onChange={(val) => updateSetting('filterWhiteBackground', val)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button Group: RECONSTRUCT, UPDATE VISUAL, CLEAR */}
          <div className="pt-6 border-t border-white/10 space-y-2.5">
            <Button
              variant="tactical"
              className="w-full"
              size="md"
              disabled={reconstructionState === 'empty' || reconstructionState === 'processing'}
              isLoading={reconstructionState === 'processing'}
              iconLeft={<Play className="w-4 h-4 fill-slate-950" />}
              onClick={handleReconstruct}
            >
              {reconstructionState === 'processing'
                ? 'Reconstructing...'
                : reconstructionState === 'ready'
                ? 'Re-Run Reconstruction'
                : 'Reconstruct'}
            </Button>

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                disabled={reconstructionState === 'empty' || reconstructionState === 'processing'}
                onClick={handleUpdateVisual}
                iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Update Visual
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={reconstructionState === 'empty' && !selectedExample}
                onClick={handleClear}
                iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Reconstruction Viewer (58% width) */}
        <div
          className={`${
            isMaximized
              ? 'fixed inset-0 z-[9999] w-screen h-screen bg-slate-950 flex flex-col m-0 rounded-none border-0 shadow-none'
              : 'lg:col-span-7 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col relative min-h-[440px]'
          }`}
        >
          {/* Viewer Window Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-300 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-1.5 font-bold text-white text-[11px] sm:text-xs tracking-wider">
                3D RECONSTRUCTION VIEWER
              </span>
              <span className="text-slate-500 hidden sm:inline">//</span>
              <span className="text-sf-cyan text-[10px] sm:text-[11px] hidden sm:inline">
                {reconstructionState === 'empty'
                  ? 'STANDBY'
                  : reconstructionState === 'uploaded'
                  ? 'VIDEO LOADED'
                  : reconstructionState === 'processing'
                  ? 'PROCESSING INFERENCE'
                  : 'PREVIEW READY'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={toggleReducedMotion}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
                  reducedMotion
                    ? 'bg-sf-amber text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {reducedMotion ? 'MOTION: PAUSED' : 'MOTION: AUTO'}
              </button>

              {/* Maximize / Minimize Button */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:text-sf-cyan hover:border-sf-cyan/60 transition-all flex items-center gap-1"
                title={isMaximized ? "Minimize View (Esc)" : "Maximize 3D View"}
                aria-label={isMaximized ? "Minimize 3D View" : "Maximize 3D View"}
              >
                {isMaximized ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-sf-cyan" />
                    <span>MINIMIZE</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>MAXIMIZE</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas Viewport */}
          <div className="relative flex-1 min-h-[380px] bg-slate-950">
            <SceneCanvas cameraPosition={[6, 5, 8]} fov={48} className="w-full h-full min-h-[380px]">
              <Hero3DScene
                reducedMotion={reducedMotion}
                showTerrain={showTerrain}
                showPointCloud={true}
                showFrustums={settings.showCamera}
                showFlightPath={showFlightPath}
                showDrone={showDrone}
                pointCount={reconstructionState === 'ready' ? calculatedPointCount : 4800}
              />
            </SceneCanvas>

            {/* OVERLAY 1: Empty Standby State */}
            {reconstructionState === 'empty' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none bg-slate-950/40">
                <div className="p-5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800/80 max-w-sm space-y-2.5 shadow-2xl">
                  <div className="w-10 h-10 rounded-xl bg-sf-cyan/10 border border-sf-cyan/40 mx-auto flex items-center justify-center text-sf-cyan shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    UPLOAD A VIDEO TO BEGIN
                  </h4>
                  <a
                    href="#examples"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[11px] font-mono text-sf-cyan/80 hover:text-sf-cyan leading-relaxed pointer-events-auto cursor-pointer hover:underline transition-colors"
                  >
                    or click any row in the Examples table below
                  </a>
                </div>
              </div>
            )}

            {/* OVERLAY 2: Uploaded State Banner */}
            {reconstructionState === 'uploaded' && (
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 pointer-events-none space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="font-bold text-white">FLIGHT DATA LOADED</span>
                  <span className="text-sf-cyan">[READY TO RECONSTRUCT]</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Click &apos;Reconstruct&apos; to run single-pass geometry preview.
                </div>
              </div>
            )}

            {/* OVERLAY 3: Staged Processing Demo Overlay */}
            {reconstructionState === 'processing' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none bg-slate-950/70 backdrop-blur-xs">
                <div className="p-6 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-sf-cyan/50 shadow-[0_0_30px_rgba(56,189,248,0.3)] max-w-md w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-sf-cyan animate-ping" />
                      <span className="font-display font-bold text-sm text-white">
                        Reconstructing 3D Scene...
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-sf-cyan">
                      {processingStatus.progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sf-cyan h-full transition-all duration-300 ease-out"
                      style={{ width: `${processingStatus.progressPercent}%` }}
                    />
                  </div>

                  {/* Staged Step List */}
                  <div className="space-y-2 text-xs font-mono pt-1">
                    {processingStatus.steps.map((step) => (
                      <div
                        key={step.name}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border ${
                          step.status === 'completed'
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                            : step.status === 'active'
                            ? 'bg-sky-950/40 border-sf-cyan text-sf-cyan font-bold'
                            : 'bg-slate-900/50 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span>{step.name}</span>
                        <span>
                          {step.status === 'completed' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          {step.status === 'active' && <Clock className="w-3.5 h-3.5 text-sf-cyan animate-spin" />}
                          {step.status === 'pending' && <span className="text-slate-600">○</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* OVERLAY 4: Ready State Status Banner & Live Telemetry Readout */}
            {reconstructionState === 'ready' && (
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 pointer-events-none space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">PREVIEW READY</span>
                  <span className="text-emerald-400">[DEMO MODEL]</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  DENSITY: <span className="text-sf-amber font-bold">{settings.maxPoints}K pts</span> | CONF: <span className="text-sf-cyan font-bold">{settings.confidenceThreshold}%</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  FRUSTUMS: {settings.showCamera ? 'VISIBLE' : 'HIDDEN'} | SKY FILTER: {settings.filterSky ? 'ON' : 'OFF'}
                </div>
              </div>
            )}

            {/* REFERENCE STYLE: 4 Callout Telemetry Pins */}
            <div className="pointer-events-none absolute inset-0 hidden sm:block">
              {/* Pin 1: Foldable Design */}
              <div className="absolute top-10 left-12 flex flex-col items-center animate-pulse">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-sans font-medium text-white shadow-lg">
                  Foldable Design
                </span>
                <div className="w-px h-6 bg-gradient-to-b from-white/40 to-emerald-400" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </div>

              {/* Pin 2: 60 Min Flight Time */}
              <div className="absolute top-8 right-24 flex flex-col items-center">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-sans font-medium text-white shadow-lg">
                  60 Min Flight Time
                </span>
                <div className="w-px h-8 bg-gradient-to-b from-white/40 to-emerald-400" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </div>

              {/* Pin 3: Obstacle Sensors */}
              <div className="absolute top-36 right-20 flex flex-col items-center">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-sans font-medium text-white shadow-lg">
                  Obstacle Sensors
                </span>
                <div className="w-px h-6 bg-gradient-to-b from-white/40 to-emerald-400" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </div>

              {/* Pin 4: 4K Ultra HD Camera */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <div className="w-px h-6 bg-gradient-to-t from-white/40 to-emerald-400" />
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-sans font-medium text-white shadow-lg">
                  4K Ultra HD Camera
                </span>
              </div>
            </div>

            {/* REFERENCE STYLE: Right Floating Preview Thumbnail Stack */}
            <div className="absolute top-8 right-3 sm:right-4 flex flex-col gap-2.5 z-20 pointer-events-auto">
              <div
                onClick={() => {
                  const el = document.getElementById('examples');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl border-2 border-white/30 hover:border-emerald-400 overflow-hidden shadow-xl bg-slate-900 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                title="Night Flight Telemetry Scan"
              >
                <img
                  src="/images/drone_thumb_1.jpg"
                  alt="Night UAV Scan"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div
                onClick={() => {
                  const el = document.getElementById('pipeline');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl border-2 border-white/30 hover:border-emerald-400 overflow-hidden shadow-xl bg-slate-900 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                title="Urban 3D Mesh Point Cloud"
              >
                <img
                  src="/images/drone_thumb_2.jpg"
                  alt="City 3D Point Cloud"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div
                onClick={() => {
                  const el = document.getElementById('workflow');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl border-2 border-white/30 hover:border-emerald-400 overflow-hidden shadow-xl bg-slate-900 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                title="Aerial LiDAR Reconnaissance"
              >
                <img
                  src="/images/drone_thumb_3.jpg"
                  alt="LiDAR Mountain Survey"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Orbit Instruction */}
            <div className="absolute top-4 left-4 pointer-events-none px-2.5 py-1 rounded-md bg-slate-950/70 border border-slate-800 text-[10px] font-mono text-slate-400">
              <span>🖱️ Drag to Orbit 3D Scene</span>
            </div>

            {/* 3D Scene Toggles Bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 max-w-[95%] overflow-x-auto">
              <button
                onClick={() => setShowTerrain(!showTerrain)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  showTerrain
                    ? 'bg-sf-indigo text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Buildings
              </button>
              <button
                onClick={() => updateSetting('showCamera', !settings.showCamera)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  settings.showCamera
                    ? 'bg-sf-amber text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Frustums ({settings.showCamera ? 'ON' : 'OFF'})
              </button>
              <button
                onClick={() => setShowFlightPath(!showFlightPath)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  showFlightPath
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Flight Path
              </button>
              <button
                onClick={() => setShowDrone(!showDrone)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  showDrone
                    ? 'bg-purple-500 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Drone
              </button>
            </div>
          </div>

          {/* Quick Format Compatibility Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs font-mono">
            <span className="text-slate-500">EXPORTS (GLB / LAS / PLY):</span>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-300">.GLB</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-300">.LAS</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-300">.PLY</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-300">CESIUM</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};
