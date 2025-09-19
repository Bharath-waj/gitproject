import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { useRobot } from "../../lib/stores/useRobot";

export default function RatRobot() {
  const robotRef = useRef<Group>(null);
  const { camera } = useThree();
  const { position, setPosition, velocity, setVelocity } = useRobot();

  // Get keyboard controls
  const [, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    if (!robotRef.current) return;

    const keys = getKeys();
    const moveSpeed = 5;
    const boostMultiplier = keys.boost ? 2 : 1;
    
    // Calculate movement direction
    const direction = new Vector3();
    
    if (keys.forward) direction.z -= 1;
    if (keys.backward) direction.z += 1;
    if (keys.leftward) direction.x -= 1;
    if (keys.rightward) direction.x += 1;
    
    // Normalize direction for consistent speed in all directions
    if (direction.length() > 0) {
      direction.normalize();
    }
    
    // Apply movement
    const newVelocity = direction.multiplyScalar(moveSpeed * boostMultiplier * delta);
    const newPosition = new Vector3(
      position.x + newVelocity.x,
      position.y,
      position.z + newVelocity.z
    );
    
    // Update robot position
    robotRef.current.position.copy(newPosition);
    setPosition(newPosition);
    setVelocity(newVelocity);
    
    // Add rotation based on movement
    if (direction.length() > 0) {
      const targetRotation = Math.atan2(direction.x, direction.z);
      robotRef.current.rotation.y = targetRotation;
    }
    
    // Add subtle bobbing animation when moving
    if (direction.length() > 0) {
      robotRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 8) * 0.05;
    }

    // Log movement for debugging
    if (direction.length() > 0) {
      console.log('Robot moving:', { x: newPosition.x.toFixed(2), z: newPosition.z.toFixed(2) });
    }
  });

  return (
    <group ref={robotRef} position={[position.x, position.y, position.z]}>
      {/* Robot Body */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
        <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Robot Head */}
      <mesh castShadow receiveShadow position={[0, 0.8, -0.4]}>
        <sphereGeometry args={[0.25, 8, 6]} />
        <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 0.85, -0.6]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.1, 0.85, -0.6]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Legs */}
      <mesh castShadow receiveShadow position={[-0.2, -0.1, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, -0.1, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.2, -0.1, -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, -0.1, -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Tail */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0.8]}>
        <cylinderGeometry args={[0.05, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      
      {/* Sensor Array */}
      <mesh position={[0, 1.0, -0.3]}>
        <boxGeometry args={[0.4, 0.1, 0.2]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#fbbf24" 
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}
