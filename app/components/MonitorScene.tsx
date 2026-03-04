'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Animated canvas texture (faux OS screen) ── */
function useScreenTexture() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    canvasRef.current = canvas;

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    textureRef.current = tex;

    return () => {
      tex.dispose();
    };
  }, []);

  const update = useCallback((time: number, progress: number) => {
    const canvas = canvasRef.current;
    const tex = textureRef.current;
    if (!canvas || !tex) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    const hue1 = (time * 8 + progress * 120) % 360;
    const hue2 = (hue1 + 40) % 360;
    grad.addColorStop(0, `hsl(${hue1}, 35%, 8%)`);
    grad.addColorStop(0.5, `hsl(${hue2}, 30%, 12%)`);
    grad.addColorStop(1, `hsl(${hue1 + 80}, 25%, 6%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Scrolling code lines
    ctx.font = '13px monospace';
    const lines = [
      'const app = createStudyNest();',
      'import { focus, learn, grow } from "mind";',
      'async function study(topic: string) {',
      '  const knowledge = await absorb(topic);',
      '  return knowledge.synthesize();',
      '}',
      'export default function Dashboard() {',
      '  const [streak, setStreak] = useState(7);',
      '  const timer = usePomodoro(25 * 60);',
      '  return <Layout theme="cozy-dark">;',
      '}',
      '// ✦ StudyNest — Your Digital Sanctuary',
      'function calculateGPA(courses: Course[]) {',
      '  return courses.reduce((sum, c) => {',
      '    return sum + c.grade * c.credits;',
      '  }, 0) / totalCredits;',
      '}',
      'const motivate = () => console.log("☕");',
    ];

    const lineH = 22;
    const scrollOffset = (time * 20 + progress * 300) % (lines.length * lineH);
    const colors = ['#F5A623', '#7AC4A8', '#F5EDD6', '#FFD27D', '#3D6B5A'];

    for (let i = 0; i < lines.length; i++) {
      const y = 40 + i * lineH - scrollOffset + lines.length * lineH;
      const adjustedY = ((y % (lines.length * lineH)) + lines.length * lineH) % (lines.length * lineH);
      if (adjustedY > 0 && adjustedY < h) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.globalAlpha = 0.7 + Math.sin(time + i) * 0.15;
        ctx.fillText(lines[i], 30 + Math.sin(i * 0.5 + time * 0.3) * 2, adjustedY);
      }
    }
    ctx.globalAlpha = 1;

    // Subtle scan line effect
    for (let y = 0; y < h; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, y, w, 1);
    }

    // Top bar
    ctx.fillStyle = 'rgba(245,166,35,0.1)';
    ctx.fillRect(0, 0, w, 28);
    ctx.fillStyle = '#F5A623';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('✦ StudyNest OS', 12, 18);
    ctx.fillStyle = '#F5EDD6';
    ctx.font = '11px Inter, sans-serif';
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    ctx.fillText(timeStr, w - 65, 18);

    tex.needsUpdate = true;
  }, []);

  return { texture: textureRef, update };
}

/* ── Floating particles ── */
function FloatingParticles() {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#F5A623"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Procedural Monitor ── */
function ProceduralMonitor({ screenTexture }: { screenTexture: React.RefObject<THREE.CanvasTexture | null> }) {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Monitor bezel */}
      <mesh castShadow>
        <boxGeometry args={[3.2, 2.0, 0.12]} />
        <meshStandardMaterial color="#1A1208" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Screen surface */}
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[2.95, 1.75]} />
        {screenTexture.current ? (
          <meshBasicMaterial map={screenTexture.current} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#0E0A05" />
        )}
      </mesh>

      {/* Screen edge glow */}
      <mesh position={[0, 0, 0.063]}>
        <boxGeometry args={[3.0, 1.8, 0.005]} />
        <meshStandardMaterial
          color="#F5A623"
          emissive="#F5A623"
          emissiveIntensity={0.08}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Chin with logo */}
      <mesh position={[0, -1.08, 0]}>
        <boxGeometry args={[3.2, 0.16, 0.12]} />
        <meshStandardMaterial color="#1A1208" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, -1.35, 0.05]}>
        <boxGeometry args={[0.15, 0.5, 0.1]} />
        <meshStandardMaterial color="#2C1E0F" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Stand base */}
      <mesh position={[0, -1.62, 0.1]} castShadow>
        <boxGeometry args={[1.0, 0.06, 0.5]} />
        <meshStandardMaterial color="#2C1E0F" roughness={0.7} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Desk ── */
function Desk() {
  return (
    <group position={[0, -1.6, 0.3]}>
      {/* Surface */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[5.0, 0.08, 2.2]} />
        <meshStandardMaterial color="#3D2B14" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Legs */}
      {[[-2.3, -0.55, -0.9], [2.3, -0.55, -0.9], [-2.3, -0.55, 0.9], [2.3, -0.55, 0.9]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.08, 1.0, 0.08]} />
          <meshStandardMaterial color="#2C1E0F" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Desk accessories ── */
function DeskAccessories() {
  return (
    <group>
      {/* Keyboard */}
      <mesh position={[0, -1.5, 0.9]} castShadow>
        <boxGeometry args={[1.2, 0.04, 0.4]} />
        <meshStandardMaterial color="#1A1208" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Key details (subtle rows) */}
      <mesh position={[0, -1.47, 0.9]}>
        <boxGeometry args={[1.1, 0.01, 0.32]} />
        <meshStandardMaterial color="#2C1E0F" roughness={0.6} />
      </mesh>

      {/* Mouse */}
      <group position={[1.0, -1.5, 0.9]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.06, 0.25]} />
          <meshStandardMaterial color="#1A1208" roughness={0.6} metalness={0.3} />
        </mesh>
      </group>

      {/* Coffee cup */}
      <group position={[-1.6, -1.42, 0.6]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#F5EDD6" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.094, 0.094, 0.01, 16]} />
          <meshStandardMaterial color="#3D2B14" roughness={0.2} />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <torusGeometry args={[0.05, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#F5EDD6" roughness={0.6} />
        </mesh>
      </group>

      {/* Books stack */}
      <group position={[2.0, -1.38, 0.4]}>
        {['#2D4A3E', '#F5A623', '#3D2B14'].map((c, i) => (
          <mesh key={i} position={[0, i * 0.08, 0]} castShadow>
            <boxGeometry args={[0.35, 0.06, 0.5]} />
            <meshStandardMaterial color={c} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Small plant */}
      <group position={[-2.0, -1.4, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.08, 0.16, 8]} />
          <meshStandardMaterial color="#3D2B14" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.14, 8, 6]} />
          <meshStandardMaterial color="#2D4A3E" roughness={0.8} />
        </mesh>
      </group>

      {/* Desk lamp */}
      <group position={[1.8, -1.1, -0.2]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
          <meshStandardMaterial color="#2C1E0F" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.03, 0.5, 0.03]} />
          <meshStandardMaterial color="#2C1E0F" roughness={0.7} metalness={0.4} />
        </mesh>
        <mesh position={[0.06, 0.52, 0]} rotation={[0, 0, 0.6]}>
          <coneGeometry args={[0.1, 0.15, 16, 1, true]} />
          <meshStandardMaterial
            color="#F5A623"
            emissive="#F5A623"
            emissiveIntensity={0.8}
            side={THREE.DoubleSide}
            roughness={0.4}
          />
        </mesh>
        {/* Lamp glow light */}
        <pointLight position={[0.06, 0.48, 0]} intensity={2} color="#FFD27D" distance={3} decay={2} />
      </group>
    </group>
  );
}

/* ── Camera Rig ── */
function CameraRig({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  const { camera } = useThree();
  const targetZ = useRef(8);
  const targetY = useRef(1.2);

  useFrame(() => {
    const p = scrollProgress.current ?? 0;

    // Camera Z: 8 (far) → 0.15 (inside screen) mapped to scroll progress
    targetZ.current = 8 - p * 7.85;
    // Camera Y: slight rise then center on screen
    targetY.current = 1.2 - p * 0.8;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY.current, 0.08);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);

    // Look at center of monitor screen
    camera.lookAt(0, 0.4, 0);
  });

  return null;
}

/* ── Main exported scene ── */
export default function MonitorScene({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  const { texture: screenTexture, update: updateScreen } = useScreenTexture();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = scrollProgress.current ?? 0;
    updateScreen(t, p);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} color="#F5EDD6" />
      <pointLight position={[-3, 4, 3]} intensity={3} color="#F5A623" distance={15} decay={2} castShadow />
      <pointLight position={[4, 2, 4]} intensity={1.5} color="#FFD27D" distance={10} decay={2} />
      <pointLight position={[0, 6, 0]} intensity={0.6} color="#2D4A3E" distance={12} decay={2} />

      {/* Monitor glow (casts light onto desk) */}
      <spotLight
        position={[0, 0.4, 1]}
        target-position={[0, -1.5, 1]}
        intensity={1.5}
        color="#F5A623"
        angle={0.8}
        penumbra={0.8}
      />

      <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.05}>
        <ProceduralMonitor screenTexture={screenTexture} />
        <Desk />
        <DeskAccessories />
      </Float>

      <FloatingParticles />

      <CameraRig scrollProgress={scrollProgress} />
    </>
  );
}
