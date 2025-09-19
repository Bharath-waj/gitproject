import { useTexture } from "@react-three/drei";
import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { createBoxAABB, createCylinderAABB, createConeAABB } from "../../lib/collision";
import { useColliders, Collider } from "../../lib/stores/useColliders";

export default function DisasterEnvironment() {
  const asphaltTexture = useTexture("/textures/asphalt.png");
  const woodTexture = useTexture("/textures/wood.jpg");
  const { setColliders } = useColliders();
  
  // Configure texture repeating
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(10, 10);
  
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(2, 2);

  // Generate debris positions
  const debrisPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 20; i++) {
      positions.push({
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 2,
        z: (Math.random() - 0.5) * 40,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        scale: 0.5 + Math.random() * 1.5,
      });
    }
    return positions;
  }, []);

  const buildingDebris = useMemo(() => {
    const debris = [];
    for (let i = 0; i < 15; i++) {
      debris.push({
        x: (Math.random() - 0.5) * 50,
        y: Math.random() * 4 + 1,
        z: (Math.random() - 0.5) * 50,
        width: 2 + Math.random() * 3,
        height: 2 + Math.random() * 6,
        depth: 2 + Math.random() * 3,
        rotY: Math.random() * Math.PI,
      });
    }
    return debris;
  }, []);

  // Compute and publish collision boxes for all environment objects
  useEffect(() => {
    const colliders: Collider[] = [];

    // Building debris colliders (boxes)
    buildingDebris.forEach((debris, index) => {
      const position = new Vector3(debris.x, debris.y, debris.z);
      const aabb = createBoxAABB(position, debris.width, debris.height, debris.depth);
      colliders.push({
        id: `building-${index}`,
        aabb,
        type: 'building',
      });
    });

    // Wooden debris colliders (scaled boxes)
    debrisPositions.slice(0, 10).forEach((pos, index) => {
      const position = new Vector3(pos.x, pos.y, pos.z);
      // Apply the same scaling used in rendering: [pos.scale, pos.scale * 0.3, pos.scale * 3]
      const width = 0.5 * pos.scale;
      const height = 0.2 * pos.scale * 0.3;
      const depth = 3 * pos.scale * 3;
      const aabb = createBoxAABB(position, width, height, depth);
      colliders.push({
        id: `wood-${index}`,
        aabb,
        type: 'wood',
      });
    });

    // Metal debris colliders (cylinders as boxes)
    debrisPositions.slice(10).forEach((pos, index) => {
      const position = new Vector3(pos.x, pos.y, pos.z);
      // Cylinder: args={[0.3, 0.3, 2, 8]} with scale=[pos.scale, pos.scale * 0.5, pos.scale]
      const radius = 0.3 * pos.scale;
      const height = 2 * pos.scale * 0.5;
      const aabb = createCylinderAABB(position, radius, height);
      colliders.push({
        id: `metal-${index}`,
        aabb,
        type: 'metal',
      });
    });

    // Collapsed wall sections
    colliders.push({
      id: 'wall-1',
      aabb: createBoxAABB(new Vector3(15, 2, 8), 8, 4, 0.5),
      type: 'wall',
    });

    colliders.push({
      id: 'wall-2',
      aabb: createBoxAABB(new Vector3(-12, 1.5, -15), 6, 3, 0.3),
      type: 'wall',
    });

    // Rubble piles (cones as boxes)
    colliders.push({
      id: 'rubble-1',
      aabb: createConeAABB(new Vector3(8, 0.5, -20), 3, 2),
      type: 'rubble',
    });

    colliders.push({
      id: 'rubble-2',
      aabb: createConeAABB(new Vector3(-18, 0.8, 12), 4, 3),
      type: 'rubble',
    });

    // Publish all collision boxes to the store
    setColliders(colliders);
    console.log(`Environment loaded with ${colliders.length} collision boxes`);
  }, [buildingDebris, debrisPositions, setColliders]);

  return (
    <group>
      {/* Ground Plane */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={asphaltTexture} />
      </mesh>

      {/* Building Debris - Large concrete blocks */}
      {buildingDebris.map((debris, index) => (
        <mesh
          key={`building-${index}`}
          castShadow
          receiveShadow
          position={[debris.x, debris.y, debris.z]}
          rotation={[0, debris.rotY, 0]}
        >
          <boxGeometry args={[debris.width, debris.height, debris.depth]} />
          <meshStandardMaterial color="#6b7280" roughness={0.8} />
        </mesh>
      ))}

      {/* Wooden Debris */}
      {debrisPositions.slice(0, 10).map((pos, index) => (
        <mesh
          key={`wood-${index}`}
          castShadow
          receiveShadow
          position={[pos.x, pos.y, pos.z]}
          rotation={[pos.rotX, pos.rotY, pos.rotZ]}
          scale={[pos.scale, pos.scale * 0.3, pos.scale * 3]}
        >
          <boxGeometry args={[0.5, 0.2, 3]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>
      ))}

      {/* Metal Debris */}
      {debrisPositions.slice(10).map((pos, index) => (
        <mesh
          key={`metal-${index}`}
          castShadow
          receiveShadow
          position={[pos.x, pos.y, pos.z]}
          rotation={[pos.rotX, pos.rotY, pos.rotZ]}
          scale={[pos.scale, pos.scale * 0.5, pos.scale]}
        >
          <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Collapsed Wall Sections */}
      <mesh castShadow receiveShadow position={[15, 2, 8]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[8, 4, 0.5]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>

      <mesh castShadow receiveShadow position={[-12, 1.5, -15]} rotation={[0, Math.PI / 4, Math.PI / 8]}>
        <boxGeometry args={[6, 3, 0.3]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>

      {/* Rubble Piles */}
      <mesh castShadow receiveShadow position={[8, 0.5, -20]}>
        <coneGeometry args={[3, 2, 8]} />
        <meshStandardMaterial color="#4b5563" roughness={1.0} />
      </mesh>

      <mesh castShadow receiveShadow position={[-18, 0.8, 12]}>
        <coneGeometry args={[4, 3, 6]} />
        <meshStandardMaterial color="#4b5563" roughness={1.0} />
      </mesh>

      {/* Atmospheric particles (dust clouds) */}
      <mesh position={[0, 8, 0]}>
        <sphereGeometry args={[20, 8, 6]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
