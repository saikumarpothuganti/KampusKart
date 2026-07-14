import React, { useMemo, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Shared Geometries ---
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

// --- Components ---
const OrigamiLeaf = ({ position, rotation, scale, color }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group rotation={[0.1, 0, 0]}> {/* Flat against the paper */}
        <mesh rotation={[0, 0.2, 0]}>
          <shapeGeometry args={[leafHalf]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, -0.2, 0]} scale={[-1, 1, 1]}>
          <shapeGeometry args={[leafHalf]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
        <mesh>
          <shapeGeometry args={[stem]} />
          <meshStandardMaterial color="#5D4037" side={THREE.DoubleSide} roughness={1} />
        </mesh>
      </group>
    </group>
  );
};

const SemiCircleLeaves = ({ isRightEdge, centerY, scaleMult = 1 }) => {
  const { viewport } = useThree();
  const centerX = isRightEdge ? (viewport.width / 2) : -(viewport.width / 2);
  // Cache bust for Vite: ensuring useRef is picked up!
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Occasional sudden shake (rustle) effect
    // We use the centerY as a phase offset so different bushes shake at different times
    const rustleActive = Math.sin(t * 1.5 + centerY) > 0.95; 
    
    if (rustleActive) {
      // Rapid, tight shaking
      groupRef.current.rotation.z = Math.sin(t * 40) * 0.03;
      groupRef.current.position.x = centerX + Math.cos(t * 50) * 0.02;
    } else {
      // Smoothly return to resting state
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, centerX, 0.1);
    }
  });
  
  return (
    <group position={[centerX, centerY, 0]} ref={groupRef}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        // Angles from -70 to 70 degrees to form a semi-circle pointing inwards
        const angleDeg = -70 + (i * (140 / 6)); 
        const angle = angleDeg * (Math.PI / 180);
        
        // Mirror for right edge
        const actualAngle = isRightEdge ? Math.PI - angle : angle;
        
        // Extremely tight radius so the base of the leaf sits inside the thinner branch!
        const r = 0.02; 
        const x = isRightEdge ? -Math.cos(angle) * r : Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        
        // Dark heritage green palette
        const color = ['#1B5E20', '#2E7D32', '#388E3C'][i % 3];
        // Extremely small scale as requested
        const scale = (0.1 + (Math.random() * 0.08)) * scaleMult;
        
        return (
          <OrigamiLeaf 
            key={i}
            position={[x, y, 0]}
            rotation={[0, 0, actualAngle]}
            scale={scale}
            color={color}
          />
        );
      })}
    </group>
  );
};

const BorderElements = () => {
  const { viewport } = useThree();
  
  // Calculate edge positions
  const leftX = -(viewport.width / 2);
  const rightX = (viewport.width / 2);
  
  // We want a continuous chain of semi-circles touching side-by-side all the way down.
  // Since the radius is ~0.3, a spacing of 0.45 puts them nicely end-to-end when scaled down.
  const spacing = 0.45; 
  const count = Math.ceil(viewport.height / spacing) + 4; // +4 to overflow edges safely
  const startY = (viewport.height / 2) + 1; // Start slightly above viewport
  
  const yPositions = Array.from({ length: count }).map((_, i) => startY - (i * spacing));
  
  const bottomY = -(viewport.height / 2) + 0.8;
  
  // Generate very straight, simple paths for the vertical branches
  const branchCurveLeft = useMemo(() => {
    const points = [];
    const steps = 30;
    const height = viewport.height + 4;
    const top = height / 2;
    for (let i = 0; i <= steps; i++) {
      const y = top - (i * (height / steps));
      // Extremely subtle wobble so it looks organic but straight
      const xOffset = Math.sin(y * 1.5) * 0.02;
      const zOffset = Math.cos(y * 2) * 0.02;
      points.push(new THREE.Vector3(leftX + xOffset, y, zOffset));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [viewport.height, leftX]);

  const branchCurveRight = useMemo(() => {
    const points = [];
    const steps = 30;
    const height = viewport.height + 4;
    const top = height / 2;
    for (let i = 0; i <= steps; i++) {
      const y = top - (i * (height / steps));
      // Extremely subtle wobble
      const xOffset = Math.sin(y * 1.5) * 0.02;
      const zOffset = Math.cos(y * 2) * 0.02;
      points.push(new THREE.Vector3(rightX - xOffset, y, zOffset));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [viewport.height, rightX]);

  return (
    <group>
      {/* Left Vertical Branch */}
      <mesh>
        <tubeGeometry args={[branchCurveLeft, Math.floor(viewport.height * 2), 0.06, 8, false]} />
        <meshStandardMaterial color="#4A3B32" roughness={1} />
      </mesh>
      
      {/* Right Vertical Branch */}
      <mesh>
        <tubeGeometry args={[branchCurveRight, Math.floor(viewport.height * 2), 0.06, 8, false]} />
        <meshStandardMaterial color="#4A3B32" roughness={1} />
      </mesh>

      {/* Left Border Continuous Semi-Circles */}
      {yPositions.map((y, i) => (
        <SemiCircleLeaves key={`left-${i}`} isRightEdge={false} centerY={y} scaleMult={0.65} />
      ))}
      
      {/* Right Border Continuous Semi-Circles */}
      {yPositions.map((y, i) => (
        <SemiCircleLeaves key={`right-${i}`} isRightEdge={true} centerY={y} scaleMult={0.65} />
      ))}
    </group>
  );
}



const BorderDecorations = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Delay mounting the 3D canvas by 100ms.
    // This allows the rest of the page content to render and stretch the parent 
    // container to its full height, preventing the WebGL context from initializing 
    // with a 0-height viewport on page refresh.
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full z-50 pointer-events-none overflow-hidden">
      <div className="w-full h-full" style={{ filter: 'drop-shadow(8px 12px 10px rgba(24, 56, 42, 0.25)) drop-shadow(2px 4px 4px rgba(0,0,0,0.15))' }}>
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 45 }} style={{ pointerEvents: 'none' }}>
          <ambientLight intensity={1.8} />
          <directionalLight position={[-5, 10, 8]} intensity={2.5} />
          <directionalLight position={[5, -5, 5]} intensity={0.5} />
          
          <BorderElements />
        </Canvas>
      </div>
    </div>
  );
};

export default BorderDecorations;
