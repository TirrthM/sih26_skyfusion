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
  samplingFps: number;
  confidenceThreshold: number;
  maxPoints: number;
  filterBlackBackground: boolean;
  filterWhiteBackground: boolean;
  showCamera: boolean;
  filterSky: boolean;
  description: string;
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
    name: 'Urban Building Orbit',
    category: 'Architecture',
    videoFileName: 'urban_facade_orbit_4k.mp4',
    fileSize: '38.4 MB',
    duration: '01:18',
    resolution: '3840 × 2160',
    thumbnailColor: '#38BDF8',
    samplingFps: 1.0,
    confidenceThreshold: 65,
    maxPoints: 1200,
    filterBlackBackground: false,
    filterWhiteBackground: false,
    showCamera: true,
    filterSky: true,
    description: '360° multi-tier drone orbit around a high-rise office complex with structural edge tracking.',
  },
  {
    id: 'ex-02-refinery',
    name: 'Industrial Refinery Asset',
    category: 'Infrastructure',
    videoFileName: 'refinery_tower_survey.mp4',
    fileSize: '52.1 MB',
    duration: '02:04',
    resolution: '1920 × 1080',
    thumbnailColor: '#F59E0B',
    samplingFps: 1.5,
    confidenceThreshold: 45,
    maxPoints: 2400,
    filterBlackBackground: true,
    filterWhiteBackground: false,
    showCamera: true,
    filterSky: false,
    description: 'Dense pipework and distillation column reconstruction with high-contrast background filtering.',
  },
  {
    id: 'ex-03-bridge',
    name: 'Suspension Bridge Span',
    category: 'Civil Engineering',
    videoFileName: 'bridge_cable_corridor.mov',
    fileSize: '44.8 MB',
    duration: '01:45',
    resolution: '3840 × 2160',
    thumbnailColor: '#10B981',
    samplingFps: 0.8,
    confidenceThreshold: 75,
    maxPoints: 3000,
    filterBlackBackground: false,
    filterWhiteBackground: true,
    showCamera: true,
    filterSky: true,
    description: 'Linear corridor aerial scan of main suspension cables and bridge roadway deck.',
  },
  {
    id: 'ex-04-telecom',
    name: 'Telecom Mast Tower',
    category: 'Telecom',
    videoFileName: 'telecom_lattice_mast.mp4',
    fileSize: '29.3 MB',
    duration: '00:54',
    resolution: '1920 × 1080',
    thumbnailColor: '#6366F1',
    samplingFps: 2.0,
    confidenceThreshold: 80,
    maxPoints: 1500,
    filterBlackBackground: true,
    filterWhiteBackground: false,
    showCamera: false,
    filterSky: true,
    description: 'Vertical spiral inspection of antenna arrays with dense thin-structure recovery.',
  },
  {
    id: 'ex-05-coastal',
    name: 'Coastal Cliff Topography',
    category: 'Terrain / GIS',
    videoFileName: 'coastal_ridge_survey.mp4',
    fileSize: '68.0 MB',
    duration: '02:30',
    resolution: '3840 × 2160',
    thumbnailColor: '#A855F7',
    samplingFps: 1.2,
    confidenceThreshold: 55,
    maxPoints: 4500,
    filterBlackBackground: false,
    filterWhiteBackground: false,
    showCamera: true,
    filterSky: false,
    description: 'Large-scale oblique shoreline topography flight with undulating terrain elevation.',
  },
];
