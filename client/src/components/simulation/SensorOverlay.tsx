import { useEffect, useState } from "react";
import { useRobot } from "../../lib/stores/useRobot";
import { Activity, Radio, Zap, Eye } from "lucide-react";

export default function SensorOverlay() {
  const { position, velocity } = useRobot();
  const [scanActive, setScanActive] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(87);

  // Simulate sensor scanning
  useEffect(() => {
    const interval = setInterval(() => {
      setScanActive(prev => !prev);
      setDetectedObjects(Math.floor(Math.random() * 5) + 1);
      setBatteryLevel(prev => Math.max(50, prev - 0.1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);

  return (
    <div className="absolute top-20 right-4 z-50 space-y-4">
      {/* Main Sensor Panel */}
      <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-green-500 text-green-400 min-w-[280px]">
        <div className="flex items-center gap-2 mb-3">
          <Activity className={`h-4 w-4 ${scanActive ? 'animate-pulse' : ''}`} />
          <h3 className="font-semibold">SENSOR ARRAY STATUS</h3>
        </div>
        
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span>Position:</span>
            <span>X:{position.x.toFixed(1)} Z:{position.z.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span>Speed:</span>
            <span>{(speed * 10).toFixed(1)} m/s</span>
          </div>
          <div className="flex justify-between">
            <span>Objects Detected:</span>
            <span className={scanActive ? 'text-yellow-400' : ''}>{detectedObjects}</span>
          </div>
        </div>
      </div>

      {/* Thermal Sensor */}
      <div className="bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-red-500 text-red-400">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-semibold">THERMAL</span>
        </div>
        <div className="text-xs font-mono">
          <div>Heat Signatures: {Math.floor(Math.random() * 3)}</div>
          <div>Temp Range: 18-24°C</div>
        </div>
      </div>

      {/* Communication */}
      <div className="bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-blue-500 text-blue-400">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="h-4 w-4" />
          <span className="text-sm font-semibold">COMMS</span>
        </div>
        <div className="text-xs font-mono">
          <div>Signal: Strong</div>
          <div>Base Link: Active</div>
        </div>
      </div>

      {/* Camera Feed Indicator */}
      <div className="bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-purple-500 text-purple-400">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-4 w-4" />
          <span className="text-sm font-semibold">CAMERA</span>
        </div>
        <div className="text-xs font-mono">
          <div>Night Vision: ON</div>
          <div>Recording: Active</div>
        </div>
      </div>

      {/* Battery Status */}
      <div className="bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-yellow-500">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-yellow-400">BATTERY</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${batteryLevel}%` }}
          ></div>
        </div>
        <div className="text-xs text-yellow-400 font-mono mt-1">
          {batteryLevel.toFixed(1)}%
        </div>
      </div>

      {/* Scanning Effect */}
      {scanActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 border-2 border-green-400 rounded-full animate-ping opacity-30"></div>
            <div className="w-24 h-24 border-2 border-green-400 rounded-full animate-ping opacity-40 absolute top-4 left-4"></div>
          </div>
        </div>
      )}
    </div>
  );
}
