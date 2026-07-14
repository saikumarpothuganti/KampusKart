import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const leafHalf = new THREE.Shape();
leafHalf.moveTo(0, 0);
leafHalf.quadraticCurveTo(1.2, 1.2, 0, 3);
leafHalf.lineTo(0, 0);

const OrigamiLeaf = ({ position, rotation, scale, color }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stem */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 4]} />
        <meshStandardMaterial color="#3E2723" roughness={1} />
      </mesh>
      
      {/* Right Fold */}
      <mesh rotation={[Math.PI / 6, 0.4, 0]}>
        <shapeGeometry args={[leafHalf]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
      
      {/* Left Fold */}
      <mesh rotation={[Math.PI / 6, -0.4, 0]} scale={[-1, 1, 1]}>
        <shapeGeometry args={[leafHalf]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
    </group>
  );
};

const HorizontalFullCircleLeaves = ({ centerX, scaleMult = 0.65 }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const phase = centerX; // Use x position to offset the animation phase so they don't all shake in sync
      groupRef.current.rotation.z = Math.sin(time * 3 + phase) * 0.08;
      groupRef.current.rotation.y = Math.cos(time * 2 + phase) * 0.08;
    }
  });

  const leaves = useMemo(() => {
    const colors = ['#1B5E20', '#2E7D32', '#388E3C', '#4CAF50', '#81C784'];
    return Array.from({ length: 10 }).map((_, i) => {
      // Create a full circle of leaves
      const angle = (i / 10) * Math.PI * 2; 
      
      const r = 0.05; // Slightly offset from the thicker branch center
      
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      
      // Point leaves radially outward
      const rotZ = angle - Math.PI / 2;

      const organicRotX = (Math.random() - 0.5) * 0.5;
      const organicRotY = (Math.random() - 0.5) * 0.5;

      return {
        position: [x, y, 0.2], // Move leaves in FRONT of the branch so it hides the branch line
        rotation: [organicRotX, organicRotY, rotZ],
        scale: (0.4 + Math.random() * 0.2) * scaleMult,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
  }, [scaleMult]);

  return (
    <group position={[centerX, 0, 0]} ref={groupRef}>
      {leaves.map((l, i) => (
        <OrigamiLeaf key={i} position={l.position} rotation={l.rotation} scale={l.scale} color={l.color} />
      ))}
    </group>
  );
};

const PaperStack = ({ position, rotation, scale }) => {
  const papers = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      y: i * 0.08,
      rotY: (Math.random() - 0.5) * 0.15,
      // Brownish green colors as requested
      color: ['#556B2F', '#4A5D23', '#6B8E23'][Math.floor(Math.random() * 3)]
    }));
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {papers.map((p, i) => (
        <mesh key={i} position={[0, p.y, 0]} rotation={[0, p.rotY, 0]}>
          <boxGeometry args={[3.5, 0.06, 2.8]} />
          <meshStandardMaterial color={p.color} roughness={1} />
        </mesh>
      ))}
    </group>
  );
};

const HorizontalBranchElements = () => {
  const { viewport } = useThree();
  
  const leftX = -(viewport.width / 2);
  const rightX = (viewport.width / 2);

  // With an orthographic camera (zoom=40), 1 unit is EXACTLY 40 pixels on screen regardless of screen size.
  // So we can use perfectly fixed, predictable sizes for everything without worrying about aspect ratio compression!
  const tubeRadius = 0.1; // 4 pixels thick
  const spacing = 3.5; // Tighter spacing since leaves are smaller
  const scaleMult = 0.6; // Significantly smaller leaves
  const wobble = 0.05;
  
  const branchCurve = useMemo(() => {
    const points = [];
    const steps = 30;
    const width = viewport.width + 4;
    const startX = leftX - 2;
    for (let i = 0; i <= steps; i++) {
      const x = startX + (i * (width / steps));
      const yOffset = Math.sin(x * 0.5) * wobble;
      const zOffset = Math.cos(x * 0.5) * wobble;
      points.push(new THREE.Vector3(x, yOffset, zOffset));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [viewport.width, leftX, wobble]);

  const count = Math.ceil(viewport.width / spacing) + 4;
  const startX = -(viewport.width / 2) - 1;
  const xPositions = Array.from({ length: count }).map((_, i) => startX + (i * spacing));

  // Determine book positions exactly halfway between rings so they NEVER collide with leaves
  // We filter to only visible rings so the math always places them perfectly on screen!
  const visibleXPositions = xPositions.filter(x => x > leftX && x < rightX);
  const leftBookX = visibleXPositions[0] + (spacing / 2);
  const rightBookX = visibleXPositions[visibleXPositions.length - 1] - (spacing / 2);

  return (
    <group>
      <mesh position={[0, 0, -0.2]}> {/* Move branch BEHIND the leaves */}
        <tubeGeometry args={[branchCurve, Math.floor(viewport.width * 2), tubeRadius, 8, false]} />
        <meshStandardMaterial color="#4A3B32" roughness={1} />
      </mesh>

      {xPositions.map((x, i) => (
        <HorizontalFullCircleLeaves key={i} centerX={x} scaleMult={scaleMult} />
      ))}

      {/* Tilt books forward on X axis (0.6 rad) so the orthographic camera can see their 3D tops! */}
      <PaperStack position={[leftBookX, 0, 0.2]} rotation={[0.6, Math.PI/8, 0]} scale={0.4} />
      <PaperStack position={[rightBookX, 0, 0.2]} rotation={[0.6, -Math.PI/8, 0]} scale={0.45} />
    </group>
  );
};

const TreeBranchDivider = ({ className = '-my-8' }) => {
  return (
    <div className={`w-full h-16 relative z-30 pointer-events-none ${className}`} style={{ filter: 'drop-shadow(4px 6px 5px rgba(24, 56, 42, 0.2))' }}>
      {/* 
        PERFORMANCE BOOST: 
        1. frameloop="demand" means this canvas only renders ONCE and then stops taking up GPU power since it's perfectly static! 
        2. dpr limits the resolution so high-end screens don't try to render at 4k resolution needlessly.
        3. orthographic completely prevents perspective stretching at the edges of ultra-wide containers!
      */}
      <Canvas orthographic frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 10], zoom: 40 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        
        <HorizontalBranchElements />
      </Canvas>
    </div>
  );
};

export default TreeBranchDivider;
