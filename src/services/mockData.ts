export interface DroneFleetItem {
  id: string;
  callsign: string;
  model: string;
  status: 'ACTIVE' | 'SCANNING' | 'RTB' | 'CHARGING' | 'CALIBRATING';
  battery: number;
  altitude: number; // in meters
  speed: number; // in km/h
  gps: {
    lat: number;
    lng: number;
    alt: number;
    satellites: number;
  };
  storageUsedPercent: number;
  activePayload: string;
  cameraFps: number;
  connectedAt: string;
}

export interface ReconstructionJob {
  id: string;
  projectName: string;
  status: 'QUEUED' | 'INGESTING' | 'POSE_ESTIMATION' | 'POINT_CLOUD' | 'MESHING' | 'COMPLETED';
  progressPercent: number;
  droneSource: string;
  frameCount: number;
  pointsGenerated: number;
  elapsedSeconds: number;
  estimatedRemainingSeconds: number;
  confidenceScore: number;
  exportFormats: string[];
}

export interface TelemetryTick {
  timestamp: string;
  droneId: string;
  pitch: number;
  roll: number;
  yaw: number;
  altitude: number;
  groundSpeed: number;
  batteryVoltage: number;
  signalStrengthDbm: number;
  pointsStreamedPerSec: number;
}

export const MOCK_DRONE_FLEET: DroneFleetItem[] = [
  {
    id: 'uav-alpha-01',
    callsign: 'SPECTRE-1',
    model: 'SkyFusion Falcon X4',
    status: 'SCANNING',
    battery: 84,
    altitude: 142.5,
    speed: 48.2,
    gps: { lat: 37.7749, lng: -122.4194, alt: 142.5, satellites: 14 },
    storageUsedPercent: 32,
    activePayload: 'Dual 4K LiDAR + Sony IMX989',
    cameraFps: 60,
    connectedAt: '2026-09-24T22:15:00Z',
  },
  {
    id: 'uav-alpha-02',
    callsign: 'VANGUARD-2',
    model: 'SkyFusion Falcon X4',
    status: 'ACTIVE',
    battery: 92,
    altitude: 180.0,
    speed: 55.4,
    gps: { lat: 37.7792, lng: -122.4145, alt: 180.0, satellites: 16 },
    storageUsedPercent: 18,
    activePayload: 'Multispectral Thermal Sensor',
    cameraFps: 60,
    connectedAt: '2026-09-24T22:20:00Z',
  },
  {
    id: 'uav-bravo-01',
    callsign: 'ORION-3',
    model: 'SkyFusion Scout RTK',
    status: 'CALIBRATING',
    battery: 67,
    altitude: 85.3,
    speed: 24.1,
    gps: { lat: 37.7710, lng: -122.4280, alt: 85.3, satellites: 12 },
    storageUsedPercent: 64,
    activePayload: 'Ultra-High Res 8K Photogrammetry',
    cameraFps: 30,
    connectedAt: '2026-09-24T22:05:00Z',
  },
  {
    id: 'uav-bravo-02',
    callsign: 'NIGHTHAWK-4',
    model: 'SkyFusion HeavyLift H6',
    status: 'RTB',
    battery: 28,
    altitude: 45.0,
    speed: 38.0,
    gps: { lat: 37.7680, lng: -122.4350, alt: 45.0, satellites: 15 },
    storageUsedPercent: 92,
    activePayload: 'Sub-surface Ground Radar + 4K Stereo',
    cameraFps: 60,
    connectedAt: '2026-09-24T21:40:00Z',
  },
];

export const MOCK_RECONSTRUCTIONS: ReconstructionJob[] = [
  {
    id: 'rec-0914-soma',
    projectName: 'Urban Sector 4 - SoMa Digital Twin',
    status: 'POINT_CLOUD',
    progressPercent: 78,
    droneSource: 'SPECTRE-1',
    frameCount: 1420,
    pointsGenerated: 2480000,
    elapsedSeconds: 84,
    estimatedRemainingSeconds: 22,
    confidenceScore: 0.964,
    exportFormats: ['GLB', 'LAS', 'PLY', 'OBJ'],
  },
  {
    id: 'rec-0915-bridge',
    projectName: 'Suspension Bridge Structural Scan',
    status: 'COMPLETED',
    progressPercent: 100,
    droneSource: 'VANGUARD-2',
    frameCount: 3650,
    pointsGenerated: 8940000,
    elapsedSeconds: 195,
    estimatedRemainingSeconds: 0,
    confidenceScore: 0.992,
    exportFormats: ['GLB', 'LAS', 'CESIUM_TILES'],
  },
  {
    id: 'rec-0916-campus',
    projectName: 'Suburban Campus Masterplan Survey',
    status: 'INGESTING',
    progressPercent: 24,
    droneSource: 'ORION-3',
    frameCount: 820,
    pointsGenerated: 450000,
    elapsedSeconds: 30,
    estimatedRemainingSeconds: 110,
    confidenceScore: 0.941,
    exportFormats: ['GLB', 'PLY'],
  },
];
