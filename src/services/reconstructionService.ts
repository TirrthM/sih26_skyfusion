export type ReconstructionState = 'empty' | 'uploaded' | 'processing' | 'ready' | 'error';

export interface VideoInputMetadata {
  fileName: string;
  fileSize: string;
  fileSizeBytes: number;
  duration?: string;
  durationSeconds?: number;
  resolution?: string;
  width?: number;
  height?: number;
  mimeType: string;
  previewUrl: string;
}

export interface ProcessingStep {
  name: string;
  status: 'pending' | 'active' | 'completed';
}

export interface ReconstructionStatus {
  state: ReconstructionState;
  progressPercent: number;
  currentStepIndex: number;
  steps: ProcessingStep[];
  message?: string;
}

export const INITIAL_PROCESSING_STEPS: ProcessingStep[] = [
  { name: 'Preparing Video & Keyframes', status: 'pending' },
  { name: 'Sampling Video Frames', status: 'pending' },
  { name: 'Estimating Camera Geometry', status: 'pending' },
  { name: 'Synthesizing 3D Point Cloud', status: 'pending' },
  { name: 'Finalizing 3D Preview', status: 'pending' },
];

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const extractBrowserVideoMetadata = (file: File): Promise<VideoInputMetadata> => {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = previewUrl;

    const timeout = setTimeout(() => {
      // Fallback if metadata event takes too long
      resolve({
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileSizeBytes: file.size,
        mimeType: file.type || 'video/mp4',
        previewUrl,
      });
    }, 4000);

    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      const width = video.videoWidth || undefined;
      const height = video.videoHeight || undefined;
      const durationSeconds = video.duration || undefined;

      resolve({
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileSizeBytes: file.size,
        duration: durationSeconds ? formatDuration(durationSeconds) : undefined,
        durationSeconds,
        resolution: width && height ? `${width} × ${height}` : undefined,
        width,
        height,
        mimeType: file.type || 'video/mp4',
        previewUrl,
      });
    };

    video.onerror = () => {
      clearTimeout(timeout);
      // Still return basic file information if video decoding fails
      resolve({
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileSizeBytes: file.size,
        mimeType: file.type || 'video/mp4',
        previewUrl,
      });
    };
  });
};

export const ReconstructionService = {
  /**
   * Validates and loads a drone video file in the browser
   */
  async processVideoUpload(file: File): Promise<VideoInputMetadata> {
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska'];
    const isExtensionVideo = /\.(mp4|mov|avi|webm|mkv)$/i.test(file.name);

    if (!validVideoTypes.includes(file.type) && !isExtensionVideo) {
      throw new Error('Unsupported video format. Please upload an MP4, MOV, AVI, or WebM drone video.');
    }

    return await extractBrowserVideoMetadata(file);
  },

  /**
   * Executes a staged demo reconstruction sequence
   */
  startDemoReconstruction(
    onStatusChange: (status: ReconstructionStatus) => void,
    onComplete: () => void
  ): () => void {
    let stepIndex = 0;
    const totalSteps = INITIAL_PROCESSING_STEPS.length;
    let cancelled = false;

    const steps = INITIAL_PROCESSING_STEPS.map((s, idx) => ({
      ...s,
      status: (idx === 0 ? 'active' : 'pending') as 'pending' | 'active' | 'completed',
    }));

    onStatusChange({
      state: 'processing',
      progressPercent: 5,
      currentStepIndex: 0,
      steps: [...steps],
      message: steps[0].name,
    });

    const stepInterval = setInterval(() => {
      if (cancelled) {
        clearInterval(stepInterval);
        return;
      }

      stepIndex++;

      if (stepIndex < totalSteps) {
        steps[stepIndex - 1].status = 'completed';
        steps[stepIndex].status = 'active';

        const progress = Math.min(95, Math.round(((stepIndex + 0.5) / totalSteps) * 100));

        onStatusChange({
          state: 'processing',
          progressPercent: progress,
          currentStepIndex: stepIndex,
          steps: [...steps],
          message: steps[stepIndex].name,
        });
      } else {
        clearInterval(stepInterval);
        steps.forEach((s) => (s.status = 'completed'));

        onStatusChange({
          state: 'ready',
          progressPercent: 100,
          currentStepIndex: totalSteps - 1,
          steps: [...steps],
          message: '3D Preview Ready',
        });

        onComplete();
      }
    }, 750); // 750ms per stage -> ~3.7s total smooth demo experience

    return () => {
      cancelled = true;
      clearInterval(stepInterval);
    };
  },
};
