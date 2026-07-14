import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Origami Bird Shapes ---

// A simple triangle for the body (pointing forward)
const bodyShape = new THREE.Shape();
bodyShape.moveTo(0, 0.4); // Nose
bodyShape.lineTo(-0.2, -0.6); // Back left
bodyShape.lineTo(0.2, -0.6); // Back right
bodyShape.lineTo(0, 0.4);

// A simple triangle for the wings (attached at the center body)
// We will draw it so the pivot is at (0,0)
const wingShape = new THREE.Shape();
wingShape.moveTo(0, 0.2); // Top attach point
wingShape.lineTo(0, -0.4); // Bottom attach point
wingShape.lineTo(0.8, -0.2); // Wing tip
wingShape.lineTo(0, 0.2);

const Bird = ({ startX, startY, speed, delay, scale = 1, color = "#FAF8F2" }) => {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime + delay;
    
    // Flapping animation
    const flapSpeed = 8;
    const flapAngle = Math.sin(t * flapSpeed) * 0.6; // Flap up and down
    
    if (leftWingRef.current && rightWingRef.current) {
      // Wings rotate around the Y axis
      leftWingRef.current.rotation.y = flapAngle;
      rightWingRef.current.rotation.y = -flapAngle;
    }

    // Flying forward (moving to the right)
    groupRef.current.position.x += speed * delta;
    
    // Synchronized swooping path: every bird follows a wave based on its X coordinate
    // This makes the whole flock fly along the exact same invisible curved path!
    const swoop = Math.sin(groupRef.current.position.x * 0.15) * 1.2;
    groupRef.current.position.y = startY + swoop;

    // Tilt the bird so its nose points along the derivative of the path (the tangent)
    // Derivative of sin(x * 0.15) * 1.2 is cos(x * 0.15) * 0.15 * 1.2
    const slope = Math.cos(groupRef.current.position.x * 0.15) * 0.18;
    
    // Base rotation is -Math.PI / 2 (facing right), add the slope tilt
    groupRef.current.rotation.z = -Math.PI / 2 + slope;

    // Reset position if it flies off screen
    if (groupRef.current.position.x > 18) {
      // Send back to the left side
      groupRef.current.position.x -= 35;
    }
  });

  return (
    <group ref={groupRef} position={[startX, startY, -2]} scale={scale} rotation={[0, 0, -Math.PI / 2]}>
      {/* Rotate the whole bird so its "forward" (Y axis of shapes) faces the direction of travel (X axis of screen) */}
      
      {/* Body */}
      <mesh>
        <shapeGeometry args={[bodyShape]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>

      {/* Left Wing (flipped horizontally) */}
      <mesh ref={leftWingRef} position={[0, 0, 0.01]}>
        <shapeGeometry args={[wingShape]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>

      {/* Right Wing */}
      <mesh ref={rightWingRef} position={[0, 0, -0.01]} scale={[-1, 1, 1]}>
        <shapeGeometry args={[wingShape]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
    </group>
  );
};

const PaperBirds = ({ className }) => {
  // Generate birds in a tighter V-formation shifted downwards over the section boundary
  const birds = useMemo(() => {
    return [
      // Leader (White paper)
      { id: 1, startX: 0, startY: -1.0, speed: 2.5, delay: 0, scale: 0.6, color: '#FAF8F2' },
      // Top trailing (Cream paper)
      { id: 2, startX: -3.5, startY: 0.0, speed: 2.5, delay: 0.3, scale: 0.5, color: '#F3EFE0' },
      // Further top trailing (Light Green)
      { id: 3, startX: -7.0, startY: 1.0, speed: 2.5, delay: 0.6, scale: 0.4, color: '#A5D6A7' },
      // Bottom trailing (Beige paper)
      { id: 4, startX: -3.5, startY: -2.0, speed: 2.5, delay: 0.4, scale: 0.5, color: '#E2DFD2' },
      // Further bottom trailing (Pale yellow)
      { id: 5, startX: -7.0, startY: -3.0, speed: 2.5, delay: 0.7, scale: 0.4, color: '#FFF59D' },
    ];
  }, []);

  return (
    <div className={className || "absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden"}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        
        {birds.map(bird => (
          <Bird key={bird.id} {...bird} />
        ))}
      </Canvas>
    </div>
  );
};

export default PaperBirds;
