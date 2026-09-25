import React from 'react';
import { Box, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

export interface WebGLFallbackProps {
  errorMessage?: string;
  onRetry?: () => void;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({
  errorMessage = 'WebGL 2.0 is not supported or encountered a context initialization error.',
  onRetry,
}) => {
  return (
    <div className="w-full h-full min-h-[380px] rounded-2xl bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-md flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-sf-amber flex items-center justify-center text-sf-amber shadow-tactile-amber">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h4 className="text-lg font-display font-bold text-white mb-1">
            3D Spatial Engine Fallback
          </h4>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            {errorMessage}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-left w-full text-xs font-mono space-y-1">
          <div className="text-slate-500">// TELEMETRY DIAGNOSTIC //</div>
          <div className="text-sf-cyan">UAV-01: STATUS_OK (TELEMETRY STREAMING)</div>
          <div className="text-sf-amber">RENDER_DRIVER: 2D SIMULATION MODE ACTIVE</div>
          <div className="text-emerald-400">POINTS STORED: 1,420,000 PTS (CACHED)</div>
        </div>

        {onRetry && (
          <Button
            variant="tactical"
            size="sm"
            onClick={onRetry}
            iconLeft={<RefreshCw className="w-4 h-4" />}
          >
            Restart 3D Engine
          </Button>
        )}
      </div>
    </div>
  );
};
