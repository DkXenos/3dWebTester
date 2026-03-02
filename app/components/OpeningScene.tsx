'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Main Planet ── */
function Planet() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.1;
    meshRef.current.rotation.x = Math.sin(t * 0.06) * 0.07;
  });

  return (
    <Float speed={1.0} rotationIntensity={0.05} floatIntensity={0.25}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.7, 128, 128]} />
        <MeshDistortMaterial
          color="#1E3A2F"
          emissive="#0D1F18"
          emissiveIntensity={0.5}
          distort={0.22}
          speed={1.2}
          roughness={0.35}
          metalness={0.65}
        />
      </mesh>
      {/* Atmosphere glow ring */}
      <mesh>
        <sphereGeometry args={[1.85, 32, 32]} />
        <meshStandardMaterial
          color="#2D4A3E"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </Float>
  );
}

/* ── Planet Rings ── */
function PlanetRings() {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (innerRef.current) innerRef.current.rotation.z = t * 0.07;
    if (outerRef.current) outerRef.current.rotation.z = -t * 0.04;
    if (dustRef.current) dustRef.current.rotation.z = t * 0.11;
  });

  const tilt: [number, number, number] = [Math.PI * 0.38, 0.15, 0];

  return (
    <group rotation={tilt}>
      <mesh ref={innerRef}>
        <torusGeometry args={[2.65, 0.22, 3, 100]} />
        <meshStandardMaterial
          color="#F5A623"
          emissive="#F5A623"
          emissiveIntensity={0.7}
          roughness={0.15}
          metalness={0.4}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh ref={outerRef}>
        <torusGeometry args={[3.3, 0.07, 3, 100]} />
        <meshStandardMaterial
          color="#F5EDD6"
          emissive="#F5EDD6"
          emissiveIntensity={0.4}
          roughness={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh ref={dustRef}>
        <torusGeometry args={[2.95, 0.1, 3, 100]} />
        <meshStandardMaterial
          color="#FFD27D"
          emissive="#FFD27D"
          emissiveIntensity={0.3}
          roughness={0.5}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

/* ── Orbiting Moons ── */
interface MoonProps {
  orbitRadius: number;
  speed: number;
  size: number;
  color: string;
  phase: number;
  tilt?: number;
}

function Moon({ orbitRadius, speed, size, color, phase, tilt = 0 }: MoonProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed + phase;
    ref.current.position.x = Math.cos(t) * orbitRadius;
    ref.current.position.z = Math.sin(t) * orbitRadius;
    ref.current.position.y = Math.sin(t * 0.7 + tilt) * 0.6;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.55}
          metalness={0.3}
        />
      </mesh>
      {/* Moon glow */}
      <mesh>
        <sphereGeometry args={[size * 1.5, 12, 12]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ── Tech Floating Orbs (icosahedra with wireframe shell) ── */
interface TechOrbProps {
  position: [number, number, number];
  rotSpeed: number;
  color: string;
  size?: number;
}

function TechOrb({ position, rotSpeed, color, size = 0.28 }: TechOrbProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * rotSpeed;
    ref.current.rotation.x = t * 0.7;
    ref.current.rotation.y = t;
    ref.current.rotation.z = t * 0.4;
  });

  return (
    <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={ref} position={position}>
        {/* Solid core */}
        <mesh>
          <icosahedronGeometry args={[size, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.85}
          />
        </mesh>
        {/* Wireframe shell */}
        <mesh>
          <icosahedronGeometry args={[size * 1.3, 1]} />
          <meshStandardMaterial
            color={color}
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Ambient Particle Cloud ── */
function ParticleCloud() {
  const count = 160;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.025;
    ref.current.rotation.x = t * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#F5A623"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Small ring of stars around scene ── */
function OrbitDust() {
  const count = 60;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 5.5 + Math.random() * 1.5;
      arr[i * 3]     = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#F5EDD6" transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

/* ── Scene Root ── */
function SceneContent() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} color="#F5EDD6" />
      <pointLight position={[6, 6, 6]}   intensity={4}   color="#F5A623" distance={20} decay={2} />
      <pointLight position={[-5, -4, 4]} intensity={2.5} color="#2D6A4F" distance={16} decay={2} />
      <pointLight position={[0, 8, -6]}  intensity={2}   color="#FFD27D" distance={18} decay={2} />
      <pointLight position={[-3, 0, 6]}  intensity={1.2} color="#F5EDD6" distance={12} decay={2} />

      {/* Planet system */}
      <Planet />
      <PlanetRings />

      {/* Moons */}
      <Moon orbitRadius={3.6} speed={0.45} size={0.22} color="#F5A623" phase={0} tilt={0.4} />
      <Moon orbitRadius={4.8} speed={0.28} size={0.14} color="#F5EDD6" phase={2.1} tilt={-0.3} />
      <Moon orbitRadius={5.8} speed={0.18} size={0.09} color="#2D4A3E" phase={4.5} tilt={0.8} />

      {/* Tech orbs */}
      <TechOrb position={[-4.2,  2.2, -1.5]} rotSpeed={0.7}  color="#F5A623" />
      <TechOrb position={[ 4.5, -1.8, -1.0]} rotSpeed={0.55} color="#2D4A3E" size={0.22} />
      <TechOrb position={[ 3.0,  3.2,  1.2]} rotSpeed={0.9}  color="#FFD27D" size={0.18} />
      <TechOrb position={[-3.5, -2.5,  2.0]} rotSpeed={0.65} color="#F5EDD6" size={0.14} />

      {/* Particles */}
      <ParticleCloud />
      <OrbitDust />
    </>
  );
}

/* ── Canvas export ── */
export default function OpeningScene() {
  return (
    <Canvas
      camera={{ fov: 48, position: [0, 0, 10], near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <SceneContent />
    </Canvas>
  );
}
