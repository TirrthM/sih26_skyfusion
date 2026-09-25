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
      className="scroll-mt-20 pt-6 sm:pt-7 md:pt-8 pb-8 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-3 sm:space-y-4"
    >
      {/* Small Compact SkyFusion Tagline */}
      <div className="text-center space-y-1 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2">
          <Badge variant="cyan" hasDot>
            SINGLE-PASS UAV 3D RECONSTRUCTION
          </Badge>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            v1.0 Workstation
          </span>
        </div>
        <h1 className="font-display text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
          Transform One Drone Flight into an Explorable 3D Scene.
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-sans max-w-lg mx-auto">
          Upload a single-pass drone video to generate an interactive 3D reconstruction preview.
        </p>
      </div>

      {/* Main Reconstruction Workspace (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        {/* Left Column: Input & Settings Panel (42% width) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-dark space-y-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sf-cyan/15 border border-sf-cyan text-sf-cyan flex items-center justify-center">
                  <Film className="w-4 h-4 text-sf-cyan" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Upload Flight Video
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
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
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Visual Update Toast Banner */}
            {visualUpdateNotice && (
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
                <Sparkles className="w-4 h-4 shrink-0 text-sf-cyan" />
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
                className={`border-2 border-dashed rounded-xl p-5 text-center space-y-2 transition-all cursor-pointer select-none ${
                  isDragging
                    ? 'border-sf-cyan bg-sky-50/70 dark:bg-sf-cyan/10 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-sf-surface-darkMuted/50 hover:border-sf-cyan hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-950 dark:border-slate-700 mx-auto flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-tactile-sm-light dark:shadow-tactile-sm-dark">
                  <UploadCloud className="w-6 h-6 text-sf-cyan" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-display font-bold text-slate-900 dark:text-white">
                    Upload Video
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
                    Drag & drop your flight video here, or click to browse
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-sf-surface-dark border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs">
                    <FileVideo className="w-3.5 h-3.5 text-sf-cyan" />
                    Browse Files
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  Supported formats: MP4, MOV, AVI, WebM
                </p>
              </div>
            )}

            {/* Uploaded Video Metadata & Preview */}
            {videoMetadata && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* Compact HTML5 Video Preview Player (or fallback for demo dataset) */}
                <div className="rounded-xl overflow-hidden border-2 border-slate-950 dark:border-sf-border-dark bg-black shadow-tactile-sm-light dark:shadow-tactile-sm-dark relative">
                  {videoMetadata.previewUrl ? (
                    <video
                      src={videoMetadata.previewUrl}
                      controls
                      className="w-full max-h-[140px] object-contain bg-black"
                    />
                  ) : (
                    <div className="h-[110px] flex flex-col items-center justify-center bg-slate-900 text-slate-300 space-y-2 p-3 text-center">
                      <Film className="w-8 h-8 text-sf-cyan animate-pulse" />
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
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-sf-surface-darkMuted border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">FILE: </span>
                    <span className="text-slate-900 dark:text-white font-bold truncate inline-block max-w-[120px]" title={videoMetadata.fileName}>
                      {videoMetadata.fileName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">SIZE: </span>
                    <span className="text-slate-900 dark:text-white font-bold">{videoMetadata.fileSize}</span>
                  </div>
                  {videoMetadata.duration && (
                    <div>
                      <span className="text-slate-500">DURATION: </span>
                      <span className="text-sf-cyan font-bold">{videoMetadata.duration}</span>
                    </div>
                  )}
                  {videoMetadata.resolution && (
                    <div>
                      <span className="text-slate-500">RES: </span>
                      <span className="text-sf-amber font-bold">{videoMetadata.resolution}</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sf-cyan hover:underline font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Replace Video
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-slate-500 hover:text-sf-rose transition-colors flex items-center gap-1"
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
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sf-cyan" />
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
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-sf-surface-darkMuted border border-slate-200 dark:border-slate-800">
                  <Switch
                    label="Show Camera"
                    checked={settings.showCamera}
                    onChange={(val) => updateSetting('showCamera', val)}
                  />
                </div>

                {/* Control 5: Filter Sky */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-sf-surface-darkMuted border border-slate-200 dark:border-slate-800">
                  <Switch
                    label="Filter Sky"
                    checked={settings.filterSky}
                    onChange={(val) => updateSetting('filterSky', val)}
                  />
                </div>

                {/* Control 6: Filter Black Background */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-sf-surface-darkMuted border border-slate-200 dark:border-slate-800">
                  <Switch
                    label="Filter Black BG"
                    checked={settings.filterBlackBackground}
                    onChange={(val) => updateSetting('filterBlackBackground', val)}
                  />
                </div>

                {/* Control 7: Filter White Background */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-sf-surface-darkMuted border border-slate-200 dark:border-slate-800">
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
          <div className="pt-6 border-t-2 border-slate-950/10 dark:border-slate-800 space-y-2">
            <Button
              variant="tactical"
              className="w-full"
              size="sm"
              disabled={reconstructionState === 'empty' || reconstructionState === 'processing'}
              isLoading={reconstructionState === 'processing'}
              iconLeft={<Play className="w-3.5 h-3.5" />}
              onClick={handleReconstruct}
            >
              {reconstructionState === 'processing'
                ? 'Reconstructing...'
                : reconstructionState === 'ready'
                ? 'Re-Run Reconstruction'
                : 'Reconstruct'}
            </Button>

            <div className="grid grid-cols-2 gap-2">
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
              : 'lg:col-span-7 rounded-2xl bg-slate-950 border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-cyan overflow-hidden flex flex-col relative min-h-[420px]'
          }`}
        >
          {/* Viewer Window Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-900 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-slate-900 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900 inline-block" />
              <span className="ml-1.5 font-bold text-white text-[11px] sm:text-xs">
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
                    ? 'bg-sf-amber text-slate-950 border-slate-900'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {reducedMotion ? 'MOTION: PAUSED' : 'MOTION: AUTO'}
              </button>

              {/* Maximize / Minimize Button */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:text-sf-cyan hover:border-sf-cyan transition-all flex items-center gap-1"
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
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none bg-slate-950/30">
                <div className="p-5 rounded-2xl bg-slate-950/85 border-2 border-slate-800 max-w-sm space-y-2.5 shadow-2xl">
                  <div className="w-10 h-10 rounded-xl bg-sf-cyan/10 border border-sf-cyan mx-auto flex items-center justify-center text-sf-cyan">
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
                <div className="p-6 rounded-2xl bg-slate-950/95 border-2 border-sf-cyan shadow-tactile-cyan max-w-md w-full space-y-4">
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

            {/* Orbit Instruction */}
            <div className="absolute top-4 right-4 pointer-events-none px-2.5 py-1 rounded-md bg-slate-950/70 border border-slate-800 text-[10px] font-mono text-slate-400">
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
    </section>
  );
};
