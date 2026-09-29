export interface ReconstructionSettings {
  samplingFps: number;
  confidenceThreshold: number;
  maxPoints: number; // in K points, e.g. 1000
  showCamera: boolean;
  filterSky: boolean;
  filterBlackBackground: boolean;
  filterWhiteBackground: boolean;
}

export interface ReconstructionExample {
  id: string;
  name: string;
  category: string;
  videoFileName: string;
  fileSize: string;
  duration: string;
  resolution: string;
  thumbnailColor: string;
  thumbnailUrl?: string;
  samplingFps: number;
  confidenceThreshold: number;
  maxPoints: number;
  filterBlackBackground: boolean;
  filterWhiteBackground: boolean;
  showCamera: boolean;
  filterSky: boolean;
  description: string;
  plyModelUrl?: string;
  modelRotation?: [number, number, number];
  modelScale?: number;
}

export const DEFAULT_RECONSTRUCTION_SETTINGS: ReconstructionSettings = {
  samplingFps: 1.0,
  confidenceThreshold: 50,
  maxPoints: 1000,
  showCamera: true,
  filterSky: false,
  filterBlackBackground: false,
  filterWhiteBackground: false,
};

export const RECONSTRUCTION_EXAMPLES: ReconstructionExample[] = [
  {
    id: 'ex-01-urban',
    name: 'Indoor video',
    category: 'Architecture',
    videoFileName: 'firstvideo.mp4',
    plyModelUrl: '/models/urban_pointcloud_origin_centered.ply',
    fileSize: '14.3 MB',
    duration: '00:57',
    resolution: '1920 × 1080',
    thumbnailColor: '#38BDF8',
    thumbnailUrl: '/videos/firstvideo_thumbnail.jpg',
    samplingFps: 1.0,
    confidenceThreshold: 65,
    maxPoints: 1200,
    filterBlackBackground: false,
    filterWhiteBackground: false,
    showCamera: true,
    filterSky: true,
    description: '360° multi-tier drone orbit around a high-rise office complex with structural edge tracking.',
    modelRotation: [-Math.PI / 2, 0, 0],
    modelScale: 12,
  },
  {
    id: 'ex-02-refinery',
    name: 'Outdoor video 1',
    category: 'Infrastructure',
    videoFileName: 'outdoor1_video.mp4',
    plyModelUrl: '/models/outdoor1_model_centered.ply',
    fileSize: '5.7 MB',
    duration: '00:22',
    resolution: '1920 × 1080',
    thumbnailColor: '#F59E0B',
    thumbnailUrl: '/videos/outdoor1_thumbnail.jpg',
    samplingFps: 1.5,
    confidenceThreshold: 45,
    maxPoints: 2400,
    filterBlackBackground: true,
    filterWhiteBackground: false,
    showCamera: true,
    filterSky: false,
    description: 'Dense pipework and distillation column reconstruction with high-contrast background filtering.',
    modelRotation: [Math.PI, 0, 0],
    modelScale: 18,
  },
  {
    id: 'ex-03-bridge',
    name: 'Outdoor video 2',
    category: 'Civil Engineering',
    videoFileName: 'outdoor2_video.mov',
    plyModelUrl: '/models/outdoor2_model_centered.ply',
    fileSize: '10.7 MB',
    duration: '00:14',
    resolution: '1920 × 1080',
    thumbnailColor: '#10B981',
    thumbnailUrl: '/videos/outdoor2_thumbnail.jpg',
    samplingFps: 0.8,
    confidenceThreshold: 75,
    maxPoints: 3000,
    filterBlackBackground: false,
    filterWhiteBackground: true,
    showCamera: true,
    filterSky: true,
    description: 'Linear corridor aerial scan of main suspension cables and bridge roadway deck.',
    modelRotation: [Math.PI - Math.PI / 7, 0, 0],
    modelScale: 28,
  },
];
