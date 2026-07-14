import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Create a folded paper leaf shape using Bezier curves
const leafHalf = new THREE.Shape();
leafHalf.moveTo(0, 0);
leafHalf.quadraticCurveTo(1.2, 1.2, 0, 3);
leafHalf.lineTo(0, 0);

const stem = new THREE.Shape();
stem.moveTo(-0.08, 0);
stem.lineTo(0.08, 0);
stem.lineTo(0.08, -0.8);
stem.lineTo(-0.08, -0.8);
stem.lineTo(-0.08, 0);

const SimpleLeaf = ({ color, scale }) => {
  return (
    <group scale={scale}>
      <group rotation={[Math.PI / 6, 0, 0]}>
        <mesh rotation={[0, 0.4, 0]}>
          <shapeGeometry args={[leafHalf]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={1} metalness={0} />
        </mesh>
        <mesh rotation={[0, -0.4, 0]} scale={[-1, 1, 1]}>
          <shapeGeometry args={[leafHalf]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={1} metalness={0} />
        </mesh>
        <mesh>
          <shapeGeometry args={[stem]} />
          <meshStandardMaterial color="#5D4037" side={THREE.DoubleSide} roughness={1} />
        </mesh>
      </group>
    </group>
  );
};

const PaperLeavesDivider = ({ leafCount = 150 }) => {
  const leaves = useMemo(() => {
    const colors = ['#1B5E20', '#2E7D32', '#388E3C', '#18382A', '#25503C'];
    return Array.from({ length: leafCount }).map((_, i) => {
      return {
        id: i,
        startXPhase: Math.random() - 0.5, 
        startYPhase: Math.random() - 0.5,
        speed: 0.02 + Math.random() * 0.03,
        scale: 0.02 + Math.random() * 0.04, // Significantly reduced leaf size
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        xPhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
  }, [leafCount]);

  return (
    // Absolute position inside the hero section, behind the text (z-0)
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 45 }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <LeavesMesh leavesData={leaves} />
      </Canvas>
    </div>
  );
};

const LeavesMesh = ({ leavesData }) => {
  const leavesRef = useRef();
  
  useFrame((state) => {
    if (!leavesRef.current) return;
    const { viewport } = state;
    
    leavesRef.current.children.forEach((leaf, i) => {
      if (!leavesData[i]) return;
      const data = leavesData[i];
      
      // Initialize position on first frame dynamically based on canvas height!
      if (leaf.position.x === 0 && leaf.position.y === 0) {
        leaf.position.x = data.startXPhase * viewport.width;
        leaf.position.y = data.startYPhase * viewport.height;
      }
      
      leaf.visible = true;

      // Highly randomized, free-falling physics
      leaf.position.y -= data.speed * 1.5; 
      
      // Chaotic flutter
      const flutterX = Math.sin(state.clock.elapsedTime * 3 + data.xPhase) * 0.03;
      const randomWind = Math.cos(state.clock.elapsedTime * 1.5 + data.id) * 0.02;
      leaf.position.x += flutterX + randomWind;
      
      // Slight vertical bobbing as if caught in an updraft
      leaf.position.y += Math.sin(state.clock.elapsedTime * 4 + data.xPhase) * 0.01;
      
      // Reset when off screen (using dynamic viewport height!)
      if (leaf.position.y < -(viewport.height / 2) - 1) {
        leaf.position.y = (viewport.height / 2) + 1; 
        leaf.position.x = (Math.random() - 0.5) * viewport.width; 
      }
      
      leaf.rotation.x += data.rotationSpeed;
      leaf.rotation.y += data.rotationSpeed * 1.5;
      leaf.rotation.z += data.rotationSpeed * 0.5;
    });
  });

  return (
    <group ref={leavesRef}>
      {leavesData.map((leaf) => (
        <SimpleLeaf key={leaf.id} color={leaf.color} scale={leaf.scale} />
      ))}
    </group>
  );
};

export default PaperLeavesDivider;
