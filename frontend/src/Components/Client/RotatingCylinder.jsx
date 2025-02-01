import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";

const RotatingCylinder = () => {
  const texture = useTexture("./demo_roller.png");
  const cylinder = useRef(null);
  const { gl } = useThree(); // Get reference to the WebGL renderer
  const [mouseX, setMouseX] = useState(0);
  const [isMouseInside, setIsMouseInside] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX } = event;
      const normalizedX = (clientX / window.innerWidth) * 2 - 1; // Normalize between -1 and 1
      setMouseX(normalizedX);
    };

    const handleMouseEnter = () => setIsMouseInside(true);
    const handleMouseLeave = () => {
      setIsMouseInside(false);
      setMouseX(0);
    };

    // Attach listeners to the canvas instead of the window
    const canvas = gl.domElement;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (cylinder.current) {
      let baseSpeed = 0.3 * delta; // Slow rotation by default
      let dynamicSpeed = isMouseInside ? mouseX * 0.5 * delta : baseSpeed; // Adjust rotation based on mouse movement

      cylinder.current.rotation.y += dynamicSpeed;
    }
  });

  return (
    <group ref={cylinder}>
      <mesh rotation={[0, -1.5, 0.2]}>
        <cylinderGeometry args={[1, 1, 1, 60, 60, true]} />
        <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default RotatingCylinder;
