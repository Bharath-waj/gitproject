import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useRobot } from "../../lib/stores/useRobot";

export default function GameCamera() {
  const { camera } = useThree();
  const { position } = useRobot();
  const targetPosition = useRef(new Vector3());
  const currentPosition = useRef(new Vector3());

  useFrame(() => {
    // Set target position behind and above the robot
    targetPosition.current.set(
      position.x + 8,
      position.y + 6,
      position.z + 8
    );

    // Smooth camera movement
    currentPosition.current.lerp(targetPosition.current, 0.05);
    camera.position.copy(currentPosition.current);

    // Look at the robot
    camera.lookAt(position.x, position.y + 1, position.z);
  });

  return null;
}
