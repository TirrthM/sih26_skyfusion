import { MOCK_DRONE_FLEET, MOCK_RECONSTRUCTIONS, DroneFleetItem, ReconstructionJob, TelemetryTick } from './mockData';

const SIMULATED_LATENCY_MS = 250;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const FleetService = {
  async getFleet(): Promise<DroneFleetItem[]> {
    await delay(SIMULATED_LATENCY_MS);
    return [...MOCK_DRONE_FLEET];
  },

  async getDroneById(id: string): Promise<DroneFleetItem | null> {
    await delay(SIMULATED_LATENCY_MS);
    return MOCK_DRONE_FLEET.find((d) => d.id === id) || null;
  },

  async updateDroneCommand(id: string, command: 'RTH' | 'HOLD' | 'RESUME_SURVEY'): Promise<boolean> {
    await delay(SIMULATED_LATENCY_MS);
    console.log(`[FleetService] Drone ${id} received command: ${command}`);
    return true;
  },
};

export const ReconstructionService = {
  async getActiveJobs(): Promise<ReconstructionJob[]> {
    await delay(SIMULATED_LATENCY_MS);
    return [...MOCK_RECONSTRUCTIONS];
  },

  async triggerReconstruction(payload: {
    projectName: string;
    droneSource: string;
    maxPoints: number;
    confidenceThreshold: number;
    exportFormats: string[];
  }): Promise<ReconstructionJob> {
    await delay(SIMULATED_LATENCY_MS * 1.5);
    const newJob: ReconstructionJob = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      projectName: payload.projectName,
      status: 'INGESTING',
      progressPercent: 5,
      droneSource: payload.droneSource,
      frameCount: 1200,
      pointsGenerated: 150000,
      elapsedSeconds: 2,
      estimatedRemainingSeconds: 90,
      confidenceScore: payload.confidenceThreshold,
      exportFormats: payload.exportFormats,
    };
    return newJob;
  },
};

export const TelemetryService = {
  subscribeLiveTelemetry(droneId: string, onTick: (tick: TelemetryTick) => void): () => void {
    let alt = 142.5;
    let speed = 48.0;
    let points = 2400000;

    const interval = setInterval(() => {
      alt += (Math.random() - 0.5) * 0.4;
      speed += (Math.random() - 0.5) * 0.8;
      points += Math.floor(Math.random() * 2500) + 1000;

      onTick({
        timestamp: new Date().toISOString(),
        droneId,
        pitch: (Math.random() - 0.5) * 4.0,
        roll: (Math.random() - 0.5) * 3.0,
        yaw: 180 + Math.sin(Date.now() / 10000) * 45,
        altitude: parseFloat(alt.toFixed(1)),
        groundSpeed: parseFloat(speed.toFixed(1)),
        batteryVoltage: 22.8 - (Date.now() % 100000) / 50000,
        signalStrengthDbm: -62 + Math.floor(Math.random() * 5),
        pointsStreamedPerSec: 18400 + Math.floor(Math.random() * 1200),
      });
    }, 1000);

    return () => clearInterval(interval);
  },
};
