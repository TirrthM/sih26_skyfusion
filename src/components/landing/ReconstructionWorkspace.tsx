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
  Check,
  Clock,
  Eye,
  Maximize2,
  Minimize2,
  Compass,
  ShieldAlert,
  Binary,
  FileSpreadsheet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
import { fadeUp } from '@/utils/motionVariants';

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
  const [calibrationFile, setCalibrationFile] = useState<{ fileName: string; fileSize: string } | null>(null);
  const [telemetryFile, setTelemetryFile] = useState<{ fileName: string; fileSize: string } | null>(null);
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
  const [showFrustums, setShowFrustums] = useState(true);

  // DOM Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const calibrationInputRef = useRef<HTMLInputElement>(null);
  const telemetryInputRef = useRef<HTMLInputElement>(null);
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
      setCalibrationFile({
        fileName: `${selectedExample.id}_calib_matrix.npy`,
        fileSize: '24.6 KB',
      });
      setTelemetryFile({
        fileName: `${selectedExample.id}_flight_telemetry.csv`,
        fileSize: '158.2 KB',
      });
      setReconstructionState('ready');
      setVisualUpdateNotice(`Loaded dataset & parameters: ${selectedExample.name}`);
      const timer = setTimeout(() => setVisualUpdateNotice(null), 3000);
      return () => clearTimeout(timer);
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
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.npy')) {
        handleCalibrationUpload(file);
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        handleTelemetryUpload(file);
      } else {
        handleFile(file);
      }
    }
  };

  const handleCalibrationUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.npy')) {
      setErrorMessage('Invalid calibration file. Please upload a .npy matrix file.');
      return;
    }
    const sizeKB = (file.size / 1024).toFixed(1) + ' KB';
    setCalibrationFile({ fileName: file.name, fileSize: sizeKB });
    setVisualUpdateNotice(`Loaded calibration matrix: ${file.name}`);
    setTimeout(() => setVisualUpdateNotice(null), 2500);
  };

  const handleTelemetryUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Invalid telemetry file. Please upload a .csv telemetry log.');
      return;
    }
    const sizeKB = (file.size / 1024).toFixed(1) + ' KB';
    setTelemetryFile({ fileName: file.name, fileSize: sizeKB });
    setVisualUpdateNotice(`Loaded telemetry log: ${file.name}`);
    setTimeout(() => setVisualUpdateNotice(null), 2500);
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
    if (calibrationInputRef.current) {
      calibrationInputRef.current.value = '';
    }
    if (telemetryInputRef.current) {
      telemetryInputRef.current.value = '';
    }
    setVideoMetadata(null);
    setCalibrationFile(null);
    setTelemetryFile(null);
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

  return (
    <section
      id="reconstruction"
      className="scroll-mt-24 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Workspace Header Narrative */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="text-center space-y-1.5 max-w-2xl mx-auto"
      >
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0B100D] dark:text-[#F1F8F9]">
          Spatial Reconstruction Workstation
        </h2>
        <p className="text-xs sm:text-sm text-[#1E293B] dark:text-slate-300 font-sans max-w-lg mx-auto">
          Upload flight video or select a scan below to generate an interactive 3D reconstruction preview.
        </p>
      </motion.div>

      {/* Main Workspace: 2-Column Responsive Layout with EXACT MATCHING HEIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Input & Upload Panel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-[32px] bg-white dark:bg-[#142026] border border-slate-300/80 dark:border-slate-700/80 shadow-aerial dark:shadow-aerial-dark space-y-5 h-full"
        >
          <div className="space-y-4">
            {/* Panel Top Heading & State Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#659AC1]/15 text-[#204C79] dark:text-[#93B8D3] flex items-center justify-center font-bold">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0B100D] dark:text-white">
                    Flight Video Input
                  </h3>
                  <p className="text-[11px] text-[#4B6670] dark:text-[#CBD5E1] font-sans">
                    Single-pass drone video source
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
                  ? 'LOADED'
                  : reconstructionState === 'processing'
                  ? 'PROCESSING'
                  : 'READY'}
              </Badge>
            </div>

            {/* Error Message Toast */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs font-mono flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notice Toast */}
            <AnimatePresence>
              {visualUpdateNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3 rounded-2xl bg-sky-50 dark:bg-[#1A2A32] border border-sky-200 dark:border-[#659AC1]/40 text-[#143252] dark:text-[#93B8D3] text-xs font-mono flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-[#37699F] dark:text-[#659AC1]" />
                  <span>{visualUpdateNotice}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty Upload Dropzone with rich contrast */}
            {reconstructionState === 'empty' && (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center space-y-3 transition-all cursor-pointer select-none ${
                  isDragging
                    ? 'border-[#37699F] dark:border-[#659AC1] bg-sky-50 dark:bg-[#1A2A32] scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-600 bg-slate-50/70 dark:bg-[#0D1518]/90 hover:border-[#37699F] dark:hover:border-[#659AC1] hover:bg-sky-50/50 dark:hover:bg-[#1A2A32]/60'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1C2C34] border border-slate-200 dark:border-slate-600 mx-auto flex items-center justify-center text-[#37699F] dark:text-[#93B8D3] shadow-sm">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-display font-bold text-[#0B100D] dark:text-white">
                    Drop Flight Video
                  </p>
                  <p className="text-xs text-[#4B6670] dark:text-[#CBD5E1] font-sans">
                    Drag & drop or click to choose local footage
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-white dark:bg-[#1C2C34] border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 shadow-xs">
                    <FileVideo className="w-3.5 h-3.5 text-[#37699F] dark:text-[#93B8D3]" />
                    Browse Files
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                  Supported: MP4, MOV, AVI, WebM (4K / 1080p)
                </p>
              </div>
            )}

            {/* Uploaded Video Metadata & Preview */}
            {videoMetadata && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {/* Video Preview Player */}
                <div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-black relative shadow-xs">
                  {videoMetadata.previewUrl ? (
                    <video
                      src={videoMetadata.previewUrl}
                      controls
                      className="w-full max-h-[140px] object-contain bg-black"
                    />
                  ) : (
                    <div className="h-[110px] flex flex-col items-center justify-center bg-[#0D1518] text-slate-300 space-y-1.5 p-3 text-center">
                      <Film className="w-6 h-6 text-[#93B8D3] animate-pulse" />
                      <span className="text-xs font-mono font-bold text-white">
                        {videoMetadata.fileName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {videoMetadata.resolution} • {videoMetadata.duration} (Curated Example)
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata Pills */}
                <div className="p-3 rounded-2xl bg-slate-100/90 dark:bg-[#1A2A32] border border-slate-200/90 dark:border-slate-700/80 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 dark:text-[#94A3B8]">FILE: </span>
                    <span className="text-[#0B100D] dark:text-white font-bold truncate inline-block max-w-[120px]" title={videoMetadata.fileName}>
                      {videoMetadata.fileName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#94A3B8]">SIZE: </span>
                    <span className="text-[#0B100D] dark:text-white font-bold">{videoMetadata.fileSize}</span>
                  </div>
                  {videoMetadata.duration && (
                    <div>
                      <span className="text-slate-500 dark:text-[#94A3B8]">DURATION: </span>
                      <span className="text-[#204C79] dark:text-[#93B8D3] font-bold">{videoMetadata.duration}</span>
                    </div>
                  )}
                  {videoMetadata.resolution && (
                    <div>
                      <span className="text-slate-500 dark:text-[#94A3B8]">RES: </span>
                      <span className="text-[#855B09] dark:text-[#FDE08B] font-bold">{videoMetadata.resolution}</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between text-xs font-mono pt-0.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#204C79] dark:text-[#93B8D3] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Replace Video
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-slate-500 dark:text-slate-400 hover:text-[#D45D5D] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                </div>
              </motion.div>
            )}

            {/* Hidden Video File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
              onChange={onFileInputChange}
              className="hidden"
              id="flight-video-file-input"
            />

            {/* Auxiliary Parameter Files: Calibration Matrix (.npy) & Telemetry (.csv) */}
            <div className="pt-2 border-t border-slate-200/90 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0B100D] dark:text-white flex items-center gap-1.5">
                  <Binary className="w-3.5 h-3.5 text-[#37699F] dark:text-[#93B8D3]" />
                  Spatial Calibration & Telemetry
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  .npy / .csv
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 1. Calibration Matrix (.npy) Upload */}
                <div
                  onClick={() => calibrationInputRef.current?.click()}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    calibrationFile
                      ? 'bg-sky-50/80 dark:bg-[#1A2A32] border-[#37699F]/60 dark:border-[#659AC1]/60'
                      : 'bg-slate-50/70 dark:bg-[#0D1518]/90 border-slate-300/80 dark:border-slate-700 hover:border-[#37699F] dark:hover:border-[#659AC1]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-white dark:bg-[#1C2C34] border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[#37699F] dark:text-[#93B8D3] shrink-0 font-mono text-[10px] font-bold">
                      .npy
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-mono font-bold text-slate-900 dark:text-white truncate">
                        {calibrationFile ? calibrationFile.fileName : 'Calibration Matrix'}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {calibrationFile ? calibrationFile.fileSize : 'Upload .npy file'}
                      </p>
                    </div>
                  </div>
                  {calibrationFile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCalibrationFile(null);
                        if (calibrationInputRef.current) calibrationInputRef.current.value = '';
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer shrink-0"
                      title="Remove calibration matrix"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* 2. Telemetry (.csv) Upload */}
                <div
                  onClick={() => telemetryInputRef.current?.click()}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    telemetryFile
                      ? 'bg-emerald-50/80 dark:bg-[#162924] border-emerald-500/60 dark:border-[#5B8769]/60'
                      : 'bg-slate-50/70 dark:bg-[#0D1518]/90 border-slate-300/80 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-[#5B8769]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-white dark:bg-[#1C2C34] border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[#2D5A3C] dark:text-[#8EBE9D] shrink-0 font-mono text-[10px] font-bold">
                      .csv
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-mono font-bold text-slate-900 dark:text-white truncate">
                        {telemetryFile ? telemetryFile.fileName : 'Flight Telemetry'}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {telemetryFile ? telemetryFile.fileSize : 'Upload .csv file'}
                      </p>
                    </div>
                  </div>
                  {telemetryFile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTelemetryFile(null);
                        if (telemetryInputRef.current) telemetryInputRef.current.value = '';
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer shrink-0"
                      title="Remove telemetry log"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Hidden File Inputs for .npy and .csv */}
              <input
                ref={calibrationInputRef}
                type="file"
                accept=".npy"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCalibrationUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="calibration-matrix-file-input"
              />
              <input
                ref={telemetryInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleTelemetryUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="telemetry-csv-file-input"
              />
            </div>

            {/* Restricted Usage Message */}
            <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 dark:border-amber-500/40 text-xs font-mono flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold uppercase tracking-wider text-[11px] text-amber-900 dark:text-amber-300 block">
                  RESTRICTED USAGE
                </span>
                <p className="text-[11px] text-amber-900/85 dark:text-amber-200/85 leading-relaxed font-sans">
                  Single-pass 3D reconstruction algorithms and calibrated spatial telemetry are restricted to authorized UAV survey operations and licensed geospatial research.{' '}
                  <a
                    href="#examples"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#204C79] dark:text-[#93B8D3] font-semibold underline hover:text-slate-950 dark:hover:text-white cursor-pointer transition-colors"
                  >
                    Click to view sample scans
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Action Button Group: RECONSTRUCT & CLEAR */}
          <div className="pt-3 border-t border-slate-200/90 dark:border-slate-700/80 space-y-2.5">
            <Button
              variant="dark-pill"
              className="w-full justify-center"
              size="md"
              disabled={reconstructionState === 'empty' || reconstructionState === 'processing'}
              isLoading={reconstructionState === 'processing'}
              iconLeft={<Play className="w-4 h-4" />}
              onClick={handleReconstruct}
            >
              {reconstructionState === 'processing'
                ? 'Reconstructing 3D Scene...'
                : reconstructionState === 'ready'
                ? 'Re-Run Reconstruction'
                : 'Reconstruct'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              disabled={reconstructionState === 'empty' && !selectedExample}
              onClick={handleClear}
              iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          </div>
        </motion.div>

        {/* Right Column: 3D Reconstruction Viewer (Matching exact height of left widget) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className={`${
            isMaximized
              ? 'fixed inset-0 z-[9999] w-screen h-screen bg-slate-950 flex flex-col m-0 rounded-none border-0 shadow-none'
              : 'lg:col-span-7 rounded-[32px] bg-slate-950 border border-slate-300/80 dark:border-slate-700/80 shadow-aerial-lg dark:shadow-aerial-dark overflow-hidden flex flex-col justify-between relative h-full min-h-[360px]'
          }`}
        >
          {/* Viewer Window Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-slate-900/95 border-b border-slate-800 text-xs font-mono text-slate-300 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5B8769] inline-block animate-pulse" />
              <span className="font-bold text-white text-[11px] sm:text-xs">
                3D RECONSTRUCTION VIEWER
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-[#93B8D3] text-[10px] sm:text-[11px] hidden sm:inline">
                {reconstructionState === 'empty'
                  ? 'STANDBY'
                  : reconstructionState === 'uploaded'
                  ? 'VIDEO LOADED'
                  : reconstructionState === 'processing'
                  ? 'PROCESSING INFERENCE'
                  : 'PREVIEW READY'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleReducedMotion}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                  reducedMotion
                    ? 'bg-[#D99B26] text-slate-950 border-[#D99B26]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {reducedMotion ? 'MOTION: PAUSED' : 'MOTION: AUTO'}
              </button>

              {/* Maximize / Minimize Button */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:text-[#93B8D3] hover:border-[#659AC1] transition-all flex items-center gap-1 cursor-pointer"
                title={isMaximized ? "Minimize View (Esc)" : "Maximize 3D View"}
                aria-label={isMaximized ? "Minimize 3D View" : "Maximize 3D View"}
              >
                {isMaximized ? (
                  <>
                    <Minimize2 className="w-3 h-3 text-[#93B8D3]" />
                    <span>MINIMIZE</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3 h-3" />
                    <span>MAXIMIZE</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas Viewport */}
          <div className="relative flex-1 w-full min-h-[260px] bg-slate-950">
            <SceneCanvas cameraPosition={[6, 5, 8]} fov={48} className="w-full h-full min-h-[260px]">
              <Hero3DScene
                reducedMotion={reducedMotion}
                showTerrain={showTerrain}
                showPointCloud={true}
                showFrustums={showFrustums}
                showFlightPath={showFlightPath}
                showDrone={showDrone}
                pointCount={2000}
              />
            </SceneCanvas>

            {/* OVERLAY 1: Empty Standby State */}
            {reconstructionState === 'empty' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none bg-slate-950/40">
                <div className="p-5 rounded-3xl bg-slate-950/85 border border-white/10 max-w-xs space-y-2 shadow-2xl backdrop-blur-md">
                  <div className="w-9 h-9 rounded-full bg-[#659AC1]/15 border border-[#659AC1]/30 mx-auto flex items-center justify-center text-[#93B8D3]">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-bold text-xs text-white tracking-wide">
                    UPLOAD A VIDEO TO BEGIN
                  </h4>
                  <a
                    href="#examples"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[11px] font-mono text-[#93B8D3] hover:text-white leading-relaxed pointer-events-auto cursor-pointer hover:underline transition-colors block"
                  >
                    or select a scan from Examples
                  </a>
                </div>
              </div>
            )}

            {/* OVERLAY 2: Uploaded State Banner */}
            {reconstructionState === 'uploaded' && (
              <div className="absolute top-3.5 left-3.5 p-3 rounded-2xl bg-slate-950/85 border border-white/10 text-xs font-mono text-slate-300 pointer-events-none space-y-0.5 shadow-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#659AC1] animate-pulse" />
                  <span className="font-bold text-white text-[11px]">FLIGHT DATA LOADED</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Click &apos;Reconstruct&apos; to run single-pass geometry preview.
                </div>
              </div>
            )}

            {/* OVERLAY 3: Staged Processing Demo Overlay */}
            {reconstructionState === 'processing' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none bg-slate-950/80 backdrop-blur-xs">
                <div className="p-5 rounded-3xl bg-slate-950/95 border border-[#659AC1]/40 shadow-2xl max-w-sm w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#659AC1] animate-ping" />
                      <span className="font-display font-bold text-xs text-white">
                        Reconstructing 3D Scene...
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#93B8D3]">
                      {processingStatus.progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#37699F] to-[#659AC1] h-full transition-all duration-300 ease-out"
                      style={{ width: `${processingStatus.progressPercent}%` }}
                    />
                  </div>

                  {/* Staged Step List */}
                  <div className="space-y-1 text-[11px] font-mono pt-0.5">
                    {processingStatus.steps.map((step) => (
                      <div
                        key={step.name}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-colors ${
                          step.status === 'completed'
                            ? 'bg-[#5B8769]/15 border-[#5B8769]/35 text-[#8EBE9D]'
                            : step.status === 'active'
                            ? 'bg-[#37699F]/25 border-[#659AC1] text-white font-bold'
                            : 'bg-slate-900/50 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span>{step.name}</span>
                        <span>
                          {step.status === 'completed' && <Check className="w-3 h-3 text-[#8EBE9D]" />}
                          {step.status === 'active' && <Clock className="w-3 h-3 text-[#93B8D3] animate-spin" />}
                          {step.status === 'pending' && <span className="text-slate-600">○</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* OVERLAY 4: Ready State Status Banner & Readout */}
            {reconstructionState === 'ready' && (
              <div className="absolute top-3.5 left-3.5 p-2.5 rounded-2xl bg-slate-950/85 border border-white/10 text-xs font-mono text-slate-300 pointer-events-none space-y-0.5 shadow-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B8769] animate-pulse" />
                  <span className="font-bold text-white text-[11px]">PREVIEW READY</span>
                  <span className="text-[#8EBE9D] text-[10px]">[3D MODEL]</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  DENSITY: <span className="text-[#D99B26] font-bold">2.48M pts</span> | ACCURACY: <span className="text-[#8EBE9D] font-bold">0.8cm</span>
                </div>
              </div>
            )}

            {/* Orbit Instruction */}
            <div className="absolute top-3.5 right-3.5 pointer-events-none px-2.5 py-1 rounded-full bg-slate-950/70 border border-white/10 text-[9px] font-mono text-slate-400 flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#93B8D3]" />
              <span>Drag to Orbit</span>
            </div>

            {/* 3D Scene Toggles Bar (Bottom Center) */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-full bg-slate-950/90 border border-white/10 max-w-[95%] overflow-x-auto shadow-xl">
              <button
                onClick={() => setShowTerrain(!showTerrain)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  showTerrain
                    ? 'bg-[#37699F] text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Buildings
              </button>
              <button
                onClick={() => setShowFrustums(!showFrustums)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  showFrustums
                    ? 'bg-[#D99B26] text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Frustums
              </button>
              <button
                onClick={() => setShowFlightPath(!showFlightPath)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  showFlightPath
                    ? 'bg-[#5B8769] text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Flight Path
              </button>
              <button
                onClick={() => setShowDrone(!showDrone)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  showDrone
                    ? 'bg-[#6D6BB0] text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Drone
              </button>
            </div>
          </div>

          {/* Quick Format Compatibility Footer */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/70 border-t border-slate-800 text-xs font-mono shrink-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">EXPORTS (GLB / LAS / PLY):</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[9px] font-bold text-slate-300">.GLB</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[9px] font-bold text-slate-300">.LAS</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[9px] font-bold text-slate-300">.PLY</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[9px] font-bold text-slate-300">CESIUM</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
