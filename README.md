# SkyFusion 🚁🌐

**Autonomous UAV Swarms & Real-Time 3D Scene Reconstruction Platform**

> Smart India Hackathon (SIH) — Problem Statement ID: 26158  
> Single-Pass Drone Video to Accurate 3D Model Generation System

---

## ⚡ Overview

SkyFusion is a next-generation web application designed for UAV flight mission planning, multi-drone fleet telemetry, and automated single-pass video to Gaussian Splatting / NeRF / Point Cloud 3D reconstruction.

### ✨ Key Features
- **Interactive 3D Reconstruction Viewer**: Real-time Three.js / R3F point cloud & terrain mesh exploration with interactive orbital controls, flight paths, density adjustment, and fullscreen inspection.
- **Drone Swarm Telemetry & Mission Control**: Dynamic flight waypoint planning, battery telemetry, coordinate mapping, and UAV status badges.
- **End-to-End Pipeline Visualization**: Interactive 4-step pipeline explaining Flight Survey, Video Parsing, Feature Matching, and 3D Splatting.
- **Live Example Datasets**: Ready-to-load pre-reconstructed sample scenes (Industrial Complex, Heritage Monument, Bridge Infrastructure, etc.).
- **Modern Glassmorphic UI**: High-contrast dark mode design with Tailwind CSS, Lucide icons, and responsive layouts.

---

## 🚀 Getting Started

Follow these simple steps to run the application locally on your machine:

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** / **pnpm**

### 2. Clone the Repository
```bash
git clone https://github.com/TirthM/SkyFusion.git
cd SkyFusion
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production (Optional)
```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (React 18 / App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Icons**: Lucide React
- **Animations**: Framer Motion
