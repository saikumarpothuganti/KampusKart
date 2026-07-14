import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// --- Shared Leaf Geometry for the Rocket Trail ---
const leafHalf = new THREE.Shape();
leafHalf.moveTo(0, 0);
leafHalf.quadraticCurveTo(1.2, 1.2, 0, 3);
leafHalf.lineTo(0, 0);

const SimpleLeaf = ({ color }) => {
  return (
    <group>
      <group rotation={[Math.PI / 6, 0, 0]}>
        <mesh rotation={[0, 0.4, 0]}>
          <shapeGeometry args={[leafHalf]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={1} />
        </mesh>
        <mesh rotation={[0, -0.4, 0]} scale={[-1, 1, 1]}>
          <shapeGeometry args={[leafHalf]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={1} />
        </mesh>
      </group>
    </group>
  );
};

// Particle emitter that throws tiny leaves from the rocket
const RocketLeaves = ({ rocketRef }) => {
  const leavesRef = useRef();
  const leafCount = 8; // "only few" leaves trailing behind

  const leavesData = useMemo(() => {
    return Array.from({ length: leafCount }).map(() => ({
      active: false,
      speed: 0.01 + Math.random() * 0.015,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      // "smallest leaves"
      baseScale: 0.03 + Math.random() * 0.03, 
      color: ['#1B5E20', '#2E7D32', '#388E3C'][Math.floor(Math.random() * 3)]
    }));
  }, []);

  const stateRef = useRef({ lastSpawnTime: 0, spawnIndex: 0 });

  useFrame((state) => {
    if (!rocketRef.current || !leavesRef.current) return;
    
    // Spawn a leaf every 0.2 seconds to keep it sparse ("only few")
    if (state.clock.elapsedTime - stateRef.current.lastSpawnTime > 0.2) {
      stateRef.current.lastSpawnTime = state.clock.elapsedTime;
      const index = stateRef.current.spawnIndex;
      const leaf = leavesRef.current.children[index];
      
      // Drop the leaf exactly at the rocket's current position
      leaf.position.copy(rocketRef.current.position);
      // Randomize initial rotation
      leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      // Reset scale so it can shrink
      leaf.scale.setScalar(leavesData[index].baseScale);
      leaf.visible = true;
      leavesData[index].active = true;
      
      stateRef.current.spawnIndex = (index + 1) % leafCount;
    }

    // Animate active leaves (fall, rotate, shrink)
    leavesRef.current.children.forEach((leaf, i) => {
      if (!leavesData[i].active) return;
      leaf.position.y -= leavesData[i].speed;
      leaf.position.x += Math.sin(state.clock.elapsedTime * 2 + i) * 0.005;
      leaf.rotation.x += leavesData[i].rotSpeed;
      leaf.rotation.y += leavesData[i].rotSpeed;
      
      // Slowly shrink to 0 to simulate fading out
      if (leaf.scale.x > 0) {
        const newScale = Math.max(0, leaf.scale.x - 0.0002);
        leaf.scale.setScalar(newScale);
        if (newScale === 0) {
          leavesData[i].active = false;
          leaf.visible = false;
        }
      }
    });
  });

  return (
    <group ref={leavesRef}>
      {leavesData.map((data, i) => (
         <group key={i} visible={false}>
           <SimpleLeaf color={data.color} />
         </group>
      ))}
    </group>
  );
};

// Create a paper airplane geometry using basic shapes
const wingShape = new THREE.Shape();
wingShape.moveTo(0, 0);       // Back center
wingShape.lineTo(1.5, -0.5);  // Back right tip
wingShape.lineTo(0, 3);       // Front nose
wingShape.lineTo(0, 0);       // Close shape

const keelShape = new THREE.Shape();
keelShape.moveTo(0, 0);
keelShape.lineTo(0, -0.8);
keelShape.lineTo(0, 3);
keelShape.lineTo(0, 0);

const RocketMesh = () => {
  const rocketRef = useRef();
  const targetAngleRef = useRef(-Math.PI / 2);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollRef.current = window.scrollY / maxScroll;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!rocketRef.current) return;
    
    const scrollProgress = scrollRef.current;
    
    // Highly sensitive path: Starts WAY off-screen left (-15) and ends WAY off-screen right (15)
    // This guarantees it won't be visible in the initial hero section until you scroll down
    const targetX = -15 + (scrollProgress * 30);
    const targetY = 8 - (scrollProgress * 16) + Math.sin(scrollProgress * Math.PI * 4) * 3;
    
    const actualX = rocketRef.current.position.x;
    const actualY = rocketRef.current.position.y;

    // Use framerate-independent dampening for perfectly smooth, buttery movement 
    // even if the user scrolls the mouse wheel very violently
    const lambda = 6; 
    const newX = THREE.MathUtils.damp(actualX, targetX, lambda, delta);
    const newY = THREE.MathUtils.damp(actualY, targetY, lambda, delta);

    rocketRef.current.position.x = newX;
    rocketRef.current.position.y = newY;
    
    // Idle float
    rocketRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.005;
    
    const moveX = newX - actualX;
    const moveY = newY - actualY;
    
    if (Math.abs(moveY) > 0.0001 || Math.abs(moveX) > 0.0001) {
      targetAngleRef.current = Math.atan2(moveY, moveX);
    }
    
    // Rotate nose to face travel direction smoothly
    rocketRef.current.rotation.z = THREE.MathUtils.damp(
      rocketRef.current.rotation.z, 
      targetAngleRef.current - Math.PI / 2, 
      lambda, 
      delta
    );
    // Slight sway
    rocketRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.8) * 0.2;
  });

  return (
    <group>
      <group ref={rocketRef} position={[-7, 5, 0]} scale={0.15}>
        <group rotation={[-Math.PI/6, 0, 0]}>
          {/* Right Wing with Text */}
          <mesh rotation={[0, 0.4, 0]}>
            <shapeGeometry args={[wingShape]} />
            <meshStandardMaterial color="#2E7D32" side={THREE.DoubleSide} roughness={1} />
            <Text
              position={[0.4, 1.2, 0.01]} // Positioned flat on the wing
              rotation={[0, 0, -1.3]} // Aligned with the wing edge
              fontSize={0.25}
              color="#F5E6D3" // Light beige text
              anchorX="center"
              anchorY="middle"
            >
              KampusKart
            </Text>
          </mesh>
          
          {/* Left Wing */}
          <mesh rotation={[0, -0.4, 0]} scale={[-1, 1, 1]}>
            <shapeGeometry args={[wingShape]} />
            <meshStandardMaterial color="#2E7D32" side={THREE.DoubleSide} roughness={1} />
          </mesh>
          
          {/* Center Fold/Body (slightly darker for depth) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <shapeGeometry args={[keelShape]} />
            <meshStandardMaterial color="#1B5E20" side={THREE.DoubleSide} roughness={1} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const ScrollRocket = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-[25] pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 15, 10]} intensity={2.5} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        
        <Suspense fallback={null}>
          <RocketMesh />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ScrollRocket;
