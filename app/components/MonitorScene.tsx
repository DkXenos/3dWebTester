'use client';

import { useRef, useEffect, useMemo, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, useGLTF, ContactShadows, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════
   Animated canvas texture (faux OS screen)
   ════════════════════════════════════════════════════════ */
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
    return () => { tex.dispose(); };
  }, []);

  const update = (time: number, progress: number) => {
    const canvas = canvasRef.current;
    const tex = textureRef.current;
    if (!canvas || !tex) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    const hue1 = (time * 8 + progress * 120) % 360;
    const hue2 = (hue1 + 40) % 360;
    grad.addColorStop(0, `hsl(${hue1}, 35%, 8%)`);
    grad.addColorStop(0.5, `hsl(${hue2}, 30%, 12%)`);
    grad.addColorStop(1, `hsl(${hue1 + 80}, 25%, 6%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

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
    for (let y = 0; y < h; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, y, w, 1);
    }
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
  };

  return { texture: textureRef, update };
}

/* ════════════════════════════════════════════════════════
   Enhanced Floating Particles
   ════════════════════════════════════════════════════════ */
function FloatingParticles() {
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.012) * 0.06;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#FFD27D"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ════════════════════════════════════════════════════════
   GLTF Model Components
   ════════════════════════════════════════════════════════ */

/* Helper to setup shadow casting */
function setupShadows(scene: THREE.Group) {
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).castShadow = true;
      (child as THREE.Mesh).receiveShadow = true;
    }
  });
}

function KeyboardModel() {
  const { scene } = useGLTF('/asset/3d/keyboard.glb');
  useEffect(() => setupShadows(scene), [scene]);
  return <primitive object={scene} position={[0, -1.52, 0.85]} scale={[0.6, 0.6, 0.6]} />;
}

function ClockModel() {
  const { scene } = useGLTF('/asset/3d/clock.glb');
  useEffect(() => setupShadows(scene), [scene]);
  return <primitive object={scene} position={[-1.8, -1.3, -0.1]} scale={[0.5, 0.5, 0.5]} rotation={[0, 0.3, 0]} />;
}

/* ── Plant pot (replaces procedural plant) ── */
function PlantModel() {
  const { scene } = useGLTF('/asset/3d/free_pilea_peperomioides_terracotta_pot.glb');
  useEffect(() => setupShadows(scene), [scene]);
  return <primitive object={scene} position={[-2.0, -1.55, 0.2]} scale={[0.8, 0.8, 0.8]} />;
}

/* ── Table lamp (replaces procedural lamp, with attached lights) ── */
function TableLampModel() {
  const { scene } = useGLTF('/asset/3d/game_ready_free_table_lamp.glb');
  useEffect(() => setupShadows(scene), [scene]);
  return (
    <group>
      <primitive object={scene} position={[1.9, -1.55, -0.3]} scale={[0.7, 0.7, 0.7]} />
      <spotLight
        position={[1.9, -0.5, -0.1]}
        target-position={[1.5, -2.15, 0.5]}
        intensity={10}
        color="#FFD27D"
        angle={0.8}
        penumbra={0.7}
        distance={5}
        decay={2}
        castShadow
      />
      <pointLight position={[1.9, -0.6, -0.2]} intensity={5} color="#FFD27D" distance={4} decay={2} />
    </group>
  );
}

/* ── Desk lamp / secondary light source ── */
function DeskLampModel() {
  const { scene } = useGLTF('/asset/3d/light_work_glb.glb');
  useEffect(() => setupShadows(scene), [scene]);
  return (
    <group>
      <primitive object={scene} position={[-4.5, -2.1, -2.5]} scale={[0.6, 0.6, 0.6]} rotation={[0, 0.4, 0]} />
      <spotLight
        position={[-4.5, -0.5, -2.5]}
        target-position={[-4.5, -2.15, -2.0]}
        intensity={6}
        color="#F5A623"
        angle={0.7}
        penumbra={0.8}
        distance={5}
        decay={2}
      />
      <pointLight position={[-4.5, -0.8, -2.5]} intensity={3} color="#F5A623" distance={4} decay={2} />
    </group>
  );
}

/* ── Side desk (left) ── */
function SideDeskLeft() {
  const { scene } = useGLTF('/asset/3d/desk.glb');
  useEffect(() => setupShadows(scene), [scene]);
  return <primitive object={scene} position={[-4.5, -2.15, -2.0]} scale={[0.5, 0.5, 0.5]} rotation={[0, 0.3, 0]} />;
}

/* ── Office desk (right) ── */
function SideDeskRight() {
  const { scene } = useGLTF('/asset/3d/Med_Office_Desk.glb');
  useEffect(() => setupShadows(scene), [scene]);
  return <primitive object={scene} position={[4.5, -2.15, -2.0]} scale={[0.5, 0.5, 0.5]} rotation={[0, -0.3, 0]} />;
}

/* ════════════════════════════════════════════════════════
   Procedural Monitor
   ════════════════════════════════════════════════════════ */
function ProceduralMonitor({ screenTexture }: { screenTexture: React.RefObject<THREE.CanvasTexture | null> }) {
  return (
    <group position={[0, 0.4, 0]}>
      <mesh castShadow>
        <boxGeometry args={[3.2, 2.0, 0.12]} />
        <meshStandardMaterial color="#1A1208" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[2.95, 1.75]} />
        {screenTexture.current ? (
          <meshBasicMaterial map={screenTexture.current} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#0E0A05" />
        )}
      </mesh>
      <mesh position={[0, 0, 0.063]}>
        <boxGeometry args={[3.05, 1.85, 0.005]} />
        <meshStandardMaterial color="#F5A623" emissive="#F5A623" emissiveIntensity={0.15} transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, -1.08, 0]}>
        <boxGeometry args={[3.2, 0.16, 0.12]} />
        <meshStandardMaterial color="#1A1208" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, -1.35, 0.05]}>
        <boxGeometry args={[0.15, 0.5, 0.1]} />
        <meshStandardMaterial color="#2C1E0F" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh position={[0, -1.62, 0.1]} castShadow>
        <boxGeometry args={[1.0, 0.06, 0.5]} />
        <meshStandardMaterial color="#2C1E0F" roughness={0.7} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   Procedural Desk (main desk, kept for precise positioning)
   ════════════════════════════════════════════════════════ */
function Desk() {
  return (
    <group position={[0, -1.6, 0.3]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[5.0, 0.08, 2.2]} />
        <meshStandardMaterial color="#3D2B14" roughness={0.85} metalness={0.05} />
      </mesh>
      {[[-2.3, -0.55, -0.9], [2.3, -0.55, -0.9], [-2.3, -0.55, 0.9], [2.3, -0.55, 0.9]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.08, 1.0, 0.08]} />
          <meshStandardMaterial color="#2C1E0F" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   Desk Accessories (small procedural items)
   ════════════════════════════════════════════════════════ */
function DeskAccessories() {
  return (
    <group>
      {/* Mouse */}
      <group position={[1.0, -1.5, 0.9]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.06, 0.25]} />
          <meshStandardMaterial color="#1A1208" roughness={0.6} metalness={0.3} />
        </mesh>
      </group>

      {/* Coffee cup with steam glow */}
      <group position={[-1.6, -1.42, 0.6]}>
        <mesh castShadow>
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
        <pointLight position={[0, 0.15, 0]} intensity={0.5} color="#FFD27D" distance={1.5} decay={2} />
      </group>

      {/* Books stack */}
      <group position={[2.0, -1.38, 0.4]}>
        {['#2D4A3E', '#F5A623', '#3D2B14', '#8B5E3C'].map((c, i) => (
          <mesh key={i} position={[0, i * 0.08, 0]} castShadow>
            <boxGeometry args={[0.35, 0.06, 0.5]} />
            <meshStandardMaterial color={c} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Pencil holder */}
      <group position={[1.4, -1.4, 0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.18, 8]} />
          <meshStandardMaterial color="#2D4A3E" roughness={0.8} />
        </mesh>
        {[0, 0.04, -0.03].map((x, i) => (
          <mesh key={i} position={[x, 0.14, i * 0.02 - 0.01]}>
            <cylinderGeometry args={[0.008, 0.008, 0.16, 6]} />
            <meshStandardMaterial color={['#F5A623', '#E8921C', '#3D2B14'][i]} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Sticky notes */}
      <group position={[-1.2, -1.53, 0.5]}>
        {['#F5A623', '#7AC4A8', '#FFD27D'].map((c, i) => (
          <mesh key={i} position={[i * 0.22, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 0.005, 0.2]} />
            <meshStandardMaterial color={c} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Headphones */}
      <group position={[-2.1, -1.46, 0.7]}>
        <mesh rotation={[Math.PI / 2, 0, 0.3]}>
          <torusGeometry args={[0.12, 0.02, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#1A1208" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[-0.1, 0, 0.1]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
          <meshStandardMaterial color="#1A1208" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0.1, 0, 0.1]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
          <meshStandardMaterial color="#1A1208" roughness={0.6} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   RGB Monitor Backlight (animated warm glow cycling)
   ════════════════════════════════════════════════════════ */
const backlightPalette = [
  new THREE.Color('#F5A623'),
  new THREE.Color('#FF6B35'),
  new THREE.Color('#C77DFF'),
  new THREE.Color('#4CC9F0'),
  new THREE.Color('#F5A623'),
];

function MonitorBacklight() {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);
  const l3 = useRef<THREE.PointLight>(null);
  const tmp = useMemo(() => new THREE.Color(), []);
  const len = backlightPalette.length;

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.08;

    const lerpColor = (offset: number) => {
      const ct = (t + offset) % len;
      const idx = Math.floor(ct);
      const frac = ct - idx;
      tmp.lerpColors(backlightPalette[idx % len], backlightPalette[(idx + 1) % len], frac);
      return tmp.clone();
    };

    if (l1.current) l1.current.color.copy(lerpColor(0));
    if (l2.current) l2.current.color.copy(lerpColor(1.5));
    if (l3.current) l3.current.color.copy(lerpColor(3));
  });

  return (
    <group position={[0, 0.4, -0.15]}>
      <pointLight ref={l1} position={[-1.3, 0, 0]} intensity={4} distance={5} decay={2} />
      <pointLight ref={l2} position={[0, 0.7, 0]} intensity={3} distance={5} decay={2} />
      <pointLight ref={l3} position={[1.3, 0, 0]} intensity={4} distance={5} decay={2} />
      {/* Soft glow plane behind monitor */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.8, 2.5]} />
        <meshBasicMaterial color="#F5A623" transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   Fairy / String Lights along back wall
   ════════════════════════════════════════════════════════ */
function FairyLights() {
  const count = 32;
  const fairyColors = ['#F5A623', '#FFD27D', '#FF8C42', '#FFECD2'];

  const bulbs = useMemo(() => {
    const data: { pos: [number, number, number]; color: string }[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const x = (t - 0.5) * 12;
      const droop = Math.sin(t * Math.PI * 2.5) * 0.35 + Math.sin(t * Math.PI * 5) * 0.12;
      const y = 3.6 + droop;
      data.push({ pos: [x, y, -4.25], color: fairyColors[i % fairyColors.length] });
    }
    return data;
  }, []);

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.0 + Math.sin(t * 1.5 + i * 0.7) * 0.5;
      }
    });
  });

  return (
    <group>
      {bulbs.map(({ pos, color }, i) => (
        <group key={i}>
          <mesh ref={(el) => { refs.current[i] = el; }} position={pos}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
          {i % 5 === 0 && (
            <pointLight position={pos} intensity={0.6} color={color} distance={2.5} decay={2} />
          )}
        </group>
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   Volumetric Light Shafts from windows
   ════════════════════════════════════════════════════════ */
function VolumetricShafts() {
  const s1 = useRef<THREE.Mesh>(null);
  const s2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (s1.current) (s1.current.material as THREE.MeshBasicMaterial).opacity = 0.025 + Math.sin(t * 0.4) * 0.008;
    if (s2.current) (s2.current.material as THREE.MeshBasicMaterial).opacity = 0.025 + Math.cos(t * 0.35) * 0.008;
  });

  const shaftMat = { color: '#F5EDD6', transparent: true, opacity: 0.03, side: THREE.DoubleSide as THREE.Side, blending: THREE.AdditiveBlending as THREE.Blending, depthWrite: false };

  return (
    <group>
      <mesh ref={s1} position={[-2.8, 0.3, -2.8]} rotation={[0.2, 0.1, 0.08]}>
        <coneGeometry args={[1.3, 5, 16, 1, true]} />
        <meshBasicMaterial {...shaftMat} />
      </mesh>
      <mesh ref={s2} position={[2.8, 0.3, -2.8]} rotation={[0.2, -0.1, -0.08]}>
        <coneGeometry args={[1.3, 5, 16, 1, true]} />
        <meshBasicMaterial {...shaftMat} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   Ceiling Pendant Light
   ════════════════════════════════════════════════════════ */
function CeilingPendant() {
  return (
    <group position={[0, 4.8, -1]}>
      {/* Wire */}
      <mesh>
        <cylinderGeometry args={[0.005, 0.005, 1.5, 6]} />
        <meshStandardMaterial color="#2C1E0F" roughness={0.7} metalness={0.8} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, -0.9, 0]}>
        <coneGeometry args={[0.3, 0.35, 16, 1, true]} />
        <meshStandardMaterial color="#3D2B14" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner shade glow */}
      <mesh position={[0, -0.85, 0]}>
        <coneGeometry args={[0.28, 0.3, 16, 1, true]} />
        <meshStandardMaterial color="#F5A623" emissive="#F5A623" emissiveIntensity={0.4} side={THREE.BackSide} transparent opacity={0.6} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, -1.05, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#FFD27D" emissive="#FFD27D" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* Pendant light cast */}
      <spotLight
        position={[0, -0.9, 0]}
        target-position={[0, -5, -1]}
        intensity={8}
        color="#FFD27D"
        angle={0.6}
        penumbra={0.8}
        distance={10}
        decay={2}
        castShadow
      />
      <pointLight position={[0, -1.0, 0]} intensity={4} color="#FFD27D" distance={8} decay={2} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   City View Through Windows
   ════════════════════════════════════════════════════════ */
function WindowCityViews() {
  const texture = useTexture('/asset/2d/citybg.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      {/* Left window city */}
      <mesh position={[-2.8, 2.0, -4.48]}>
        <planeGeometry args={[1.65, 2.1]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={0.55} />
      </mesh>
      {/* Right window city */}
      <mesh position={[2.8, 2.0, -4.48]}>
        <planeGeometry args={[1.65, 2.1]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={0.55} />
      </mesh>
      {/* Subtle city glow behind each window */}
      <pointLight position={[-2.8, 2.5, -4.2]} intensity={1.5} color="#4488AA" distance={4} decay={2} />
      <pointLight position={[2.8, 2.5, -4.2]} intensity={1.5} color="#4488AA" distance={4} decay={2} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   Room Enclosure (walls, floor, ceiling, windows)
   ════════════════════════════════════════════════════════ */
function Room() {
  const wallColor = '#1C150E';

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -2.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#0F0B07" roughness={0.92} metalness={0.0} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -4.5]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.88} metalness={0.02} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-7, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.88} metalness={0.02} />
      </mesh>

      {/* Right wall */}
      <mesh position={[7, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.88} metalness={0.02} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 5.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#0F0B07" roughness={0.95} />
      </mesh>

      {/* ── Wall-wash lights ── */}
      <spotLight position={[0, -1.0, -3.5]} target-position={[0, 3, -4.5]} intensity={8} color="#F5A623" angle={1.0} penumbra={0.9} distance={8} decay={2} />
      <pointLight position={[0, 3, -3.5]} intensity={3} color="#FFD27D" distance={6} decay={2} />
      <pointLight position={[-5.5, 2.5, -1]} intensity={2} color="#F5A623" distance={6} decay={2} />
      <pointLight position={[5.5, 2.5, -1]} intensity={2} color="#F5A623" distance={6} decay={2} />

      {/* Ceiling warm spots */}
      <spotLight position={[-3, 4.8, -2]} target-position={[-3, 0, -2]} intensity={3} color="#FFD27D" angle={0.6} penumbra={0.8} distance={8} decay={2} />
      <spotLight position={[3, 4.8, -2]} target-position={[3, 0, -2]} intensity={3} color="#FFD27D" angle={0.6} penumbra={0.8} distance={8} decay={2} />

      {/* ── Windows ── */}
      {[[-2.8, 2.0, -4.45], [2.8, 2.0, -4.45]].map(([wx, wy, wz], wi) => (
        <group key={wi} position={[wx, wy, wz]}>
          {/* Frame */}
          <mesh>
            <boxGeometry args={[2.0, 2.5, 0.06]} />
            <meshStandardMaterial color="#1A1208" roughness={0.7} metalness={0.3} />
          </mesh>
          {/* Glass — slightly transparent to show city behind */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[1.7, 2.15]} />
            <meshStandardMaterial color="#0A0A15" roughness={0.08} metalness={0.6} transparent opacity={0.45} envMapIntensity={0.4} />
          </mesh>
          {/* Frame inner glow */}
          <mesh position={[0, 0, 0.032]}>
            <boxGeometry args={[1.8, 2.25, 0.003]} />
            <meshStandardMaterial color="#F5A623" emissive="#F5A623" emissiveIntensity={0.04} transparent opacity={0.2} />
          </mesh>
          {/* Dividers */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[1.8, 0.04, 0.02]} />
            <meshStandardMaterial color="#1A1208" roughness={0.7} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.04, 2.3, 0.02]} />
            <meshStandardMaterial color="#1A1208" roughness={0.7} metalness={0.3} />
          </mesh>
          {/* Sill */}
          <mesh position={[0, -1.3, 0.12]}>
            <boxGeometry args={[2.2, 0.06, 0.22]} />
            <meshStandardMaterial color="#2C1E0F" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* ── Under-desk warm LED strip ── */}
      <pointLight position={[0, -1.85, 0.3]} intensity={2} color="#F5A623" distance={3} decay={2} />
      <pointLight position={[-1.5, -1.85, 0.3]} intensity={1.5} color="#FFD27D" distance={2.5} decay={2} />
      <pointLight position={[1.5, -1.85, 0.3]} intensity={1.5} color="#FFD27D" distance={2.5} decay={2} />
      {/* LED strip mesh */}
      <mesh position={[0, -1.63, 0.3]}>
        <boxGeometry args={[4.8, 0.02, 0.02]} />
        <meshStandardMaterial color="#F5A623" emissive="#F5A623" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   Camera Rig
   ════════════════════════════════════════════════════════ */
function CameraRig({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  const { camera } = useThree();
  const targetZ = useRef(8);
  const targetY = useRef(1.2);

  useFrame(() => {
    const p = scrollProgress.current ?? 0;
    targetZ.current = 8 - p * 7.85;
    targetY.current = 1.2 - p * 0.8;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY.current, 0.08);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);
    camera.lookAt(0, 0.4, 0);
  });

  return null;
}

/* ════════════════════════════════════════════════════════
   Scene Fog Setup
   ════════════════════════════════════════════════════════ */
function SceneFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#0A0705', 0.028);
    return () => { scene.fog = null; };
  }, [scene]);
  return null;
}

/* ════════════════════════════════════════════════════════
   Main Scene
   ════════════════════════════════════════════════════════ */
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
      {/* ── Atmospheric Fog ── */}
      <SceneFog />

      {/* ── EXR Environment for reflections ── */}
      <Suspense fallback={null}>
        <Environment files="/asset/exr/mainbg.exr" background={false} />
      </Suspense>

      {/* ── Global Lighting ── */}
      <ambientLight intensity={0.6} color="#FFD27D" />
      <hemisphereLight color="#FFD27D" groundColor="#3D2B14" intensity={0.4} />

      {/* Key light — warm overhead */}
      <pointLight position={[-3, 5, 4]} intensity={5} color="#F5A623" distance={20} decay={2} castShadow />
      {/* Fill light — softer warm */}
      <pointLight position={[4, 3, 5]} intensity={3} color="#FFD27D" distance={15} decay={2} />
      {/* Rim light — cool accent */}
      <pointLight position={[0, 6, -3]} intensity={2} color="#7AC4A8" distance={15} decay={2} />
      {/* Low warm fill */}
      <pointLight position={[0, -0.5, 4]} intensity={1.5} color="#F5A623" distance={10} decay={2} />
      {/* Side fills */}
      <pointLight position={[-4, 1, 1]} intensity={1.5} color="#FFD27D" distance={8} decay={2} />
      <pointLight position={[4, 1, 1]} intensity={1.5} color="#FFD27D" distance={8} decay={2} />
      {/* Monitor screen glow onto desk */}
      <spotLight position={[0, 0.4, 1.5]} target-position={[0, -1.5, 1]} intensity={5} color="#F5A623" angle={0.9} penumbra={0.8} distance={6} decay={2} />

      {/* ── Monitor Backlight (animated RGB) ── */}
      <MonitorBacklight />

      {/* ── Ceiling Pendant ── */}
      <CeilingPendant />

      {/* ── Room Enclosure ── */}
      <Room />

      {/* ── City View Through Windows ── */}
      <Suspense fallback={null}>
        <WindowCityViews />
      </Suspense>

      {/* ── Fairy Lights ── */}
      <FairyLights />

      {/* ── Volumetric Light Shafts ── */}
      <VolumetricShafts />

      {/* Contact shadows */}
      <Suspense fallback={null}>
        <ContactShadows position={[0, -2.15, 0]} opacity={0.4} blur={2} scale={12} far={4} resolution={512} color="#000000" />
      </Suspense>

      {/* ── Main Desk Area (floating) ── */}
      <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.05}>
        <ProceduralMonitor screenTexture={screenTexture} />
        <Desk />
        <DeskAccessories />

        <Suspense fallback={null}>
          <KeyboardModel />
          <ClockModel />
          <PlantModel />
          <TableLampModel />
        </Suspense>
      </Float>

      {/* ── Side Furniture (static) ── */}
      <Suspense fallback={null}>
        <SideDeskLeft />
        <SideDeskRight />
        <DeskLampModel />
      </Suspense>

      {/* ── Atmosphere ── */}
      <FloatingParticles />

      <CameraRig scrollProgress={scrollProgress} />
    </>
  );
}

/* ── Preload all GLTF assets ── */
useGLTF.preload('/asset/3d/keyboard.glb');
useGLTF.preload('/asset/3d/clock.glb');
useGLTF.preload('/asset/3d/desk.glb');
useGLTF.preload('/asset/3d/Med_Office_Desk.glb');
useGLTF.preload('/asset/3d/free_pilea_peperomioides_terracotta_pot.glb');
useGLTF.preload('/asset/3d/game_ready_free_table_lamp.glb');
useGLTF.preload('/asset/3d/light_work_glb.glb');
