'use client';

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Materials ── */
function WarmMaterial({ color, roughness = 0.6, metalness = 0.1 }: {
  color: string; roughness?: number; metalness?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
    />
  );
}

/* ── Lofi Workstation Parts ── */
function Desk({ deconstructProgress }: { deconstructProgress: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = -1.2 - deconstructProgress * 2;
    }
  });

  return (
    <group ref={ref} position={[0, -1.2, 0]}>
      {/* Desktop surface */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.08, 1.8]} />
        <meshStandardMaterial color="#3D2B14" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Desk legs */}
      {[[-1.65, -0.55, -0.75], [1.65, -0.55, -0.75], [-1.65, -0.55, 0.75], [1.65, -0.55, 0.75]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.1, 1.0, 0.1]} />
          <meshStandardMaterial color="#2C1E0F" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Monitor({ deconstructProgress }: { deconstructProgress: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = deconstructProgress * 3.5;
      ref.current.position.y = -0.1 + deconstructProgress * 1.5;
    }
  });
  return (
    <group ref={ref} position={[0, -0.1, -0.55]}>
      {/* Screen bezel */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.9, 0.06]} />
        <meshStandardMaterial color="#1A1208" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Screen glow */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[1.28, 0.78, 0.01]} />
        <meshStandardMaterial
          color="#F5A623"
          emissive="#F5A623"
          emissiveIntensity={0.35}
          roughness={0.1}
        />
      </mesh>
      {/* Stand neck */}
      <mesh position={[0, -0.55, 0.1]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color="#1A1208" roughness={0.8} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, -0.68, 0.1]}>
        <boxGeometry args={[0.4, 0.04, 0.22]} />
        <meshStandardMaterial color="#1A1208" roughness={0.8} metalness={0.3} />
      </mesh>
    </group>
  );
}

function Lamp({ deconstructProgress }: { deconstructProgress: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = -2 - deconstructProgress * 2;
      ref.current.position.y = deconstructProgress * 2;
    }
  });
  return (
    <group ref={ref} position={[-1.5, -0.8, -0.4]}>
      {/* Base */}
      <mesh><cylinderGeometry args={[0.12, 0.14, 0.05, 16]} /><meshStandardMaterial color="#2C1E0F" roughness={0.8} /></mesh>
      {/* Arm 1 */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.04, 0.55, 0.04]} />
        <meshStandardMaterial color="#2C1E0F" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Arm 2 */}
      <mesh position={[0.1, 0.72, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        <meshStandardMaterial color="#2C1E0F" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Lampshade */}
      <mesh position={[0.22, 0.98, 0]} rotation={[0, 0, 0.8]}>
        <coneGeometry args={[0.12, 0.18, 16, 1, true]} />
        <meshStandardMaterial color="#F5A623" emissive="#F5A623" emissiveIntensity={0.9} side={THREE.DoubleSide} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Books({ deconstructProgress }: { deconstructProgress: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = 1.8 + deconstructProgress * 2.5;
      ref.current.position.y = deconstructProgress * 1.8;
    }
  });
  const colors = ['#2D4A3E', '#F5A623', '#3D2B14', '#2D4A3E'];
  return (
    <group ref={ref} position={[1.6, -0.94, -0.5]}>
      {colors.map((c, i) => (
        <mesh key={i} position={[i * 0.12 - 0.18, i * 0.005, 0]} rotation={[0, -0.05, -0.04]}>
          <boxGeometry args={[0.1, 0.55, 0.35]} />
          <meshStandardMaterial color={c} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function CoffeeCup({ deconstructProgress }: { deconstructProgress: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = deconstructProgress * -3;
      ref.current.position.y = deconstructProgress * 3;
    }
  });
  return (
    <group ref={ref} position={[0.9, -1.12, 0.5]}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.08, 0.18, 16]} />
        <meshStandardMaterial color="#F5EDD6" roughness={0.6} />
      </mesh>
      {/* Coffee liquid */}
      <mesh position={[0, 0.085, 0]}>
        <cylinderGeometry args={[0.094, 0.094, 0.01, 16]} />
        <meshStandardMaterial color="#3D2B14" roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.12, 0, 0]}>
        <torusGeometry args={[0.05, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#F5EDD6" roughness={0.6} />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#F5A623" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ── Scene inner component ── */
function WorkstationScene({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.8, 5);
  }, [camera]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle auto-rotation
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.15 + scrollProgress * Math.PI * 0.8;
      groupRef.current.rotation.x = scrollProgress * 0.3;
      // Float up as deconstructed
      groupRef.current.position.y = scrollProgress * 1.5;
      // Scale down
      const scale = 1 - scrollProgress * 0.3;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} color="#F5EDD6" />
      <pointLight position={[-2, 3, 2]} intensity={3} color="#F5A623" distance={12} decay={2} castShadow />
      <pointLight position={[3, 1, 3]} intensity={1.5} color="#FFD27D" distance={8} decay={2} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#2D4A3E" distance={10} decay={2} />
      <spotLight position={[-1.5, 2, -0.4]} target-position={[-1.5, -1.2, -0.4]} intensity={4} color="#FFD27D" angle={0.4} penumbra={0.6} castShadow />

      <group ref={groupRef}>
        <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.15}>
          <Desk deconstructProgress={scrollProgress} />
          <Monitor deconstructProgress={scrollProgress} />
          <Lamp deconstructProgress={scrollProgress} />
          <Books deconstructProgress={scrollProgress} />
          <CoffeeCup deconstructProgress={scrollProgress} />
        </Float>
      </group>
      <FloatingParticles />
    </>
  );
}

/* ── Exported Canvas component ── */
export default function HeroScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 45, near: 0.1, far: 100 }}
      style={{ background: 'transparent' }}
    >
      <WorkstationScene scrollProgress={scrollProgress} />
    </Canvas>
  );
}
