import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Lighting() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (directionalLightRef.current) {
      // Subtle light movement for dynamic shadows
      directionalLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 5;
      directionalLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.3) * 5;
    }
  });

  return (
    <>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.2} color="#4338ca" />
      
      {/* Main directional light (simulating emergency lighting) */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={0.8}
        color="#fbbf24"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Secondary light for fill */}
      <directionalLight
        position={[-5, 8, -5]}
        intensity={0.3}
        color="#3b82f6"
      />
      
      {/* Point light for dramatic effect */}
      <pointLight
        position={[0, 15, 0]}
        intensity={0.5}
        color="#ef4444"
        distance={30}
        decay={2}
      />
      
      {/* Spot light for focused illumination */}
      <spotLight
        position={[15, 20, 15]}
        intensity={0.6}
        color="#10b981"
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={40}
        decay={2}
        castShadow
      />
    </>
  );
}
