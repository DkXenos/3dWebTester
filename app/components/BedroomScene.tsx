'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect } from 'react';
import Scene from './Scene';

// Force the Three.js scene background to pure black so there's no grey/white
// default clear colour before the EXR finishes loading.
function SceneBackground() {
  const { scene, gl } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(0x000000);
    gl.setClearColor(0x000000, 1);
  }, [scene, gl]);
  return null;
}

export default function BedroomScene() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
      }}
    >
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.55,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ fov: 100, near: 0.05, far: 50, position: [0, 1.4, 2.5] }}
        style={{ background: '#000000' }}
      >
        {/* Force black clear colour before EXR loads */}
        <SceneBackground />

        <Scene />

        {/* Look-around controls — camera orbits around the room interior */}
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.25}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 2.5}
          maxAzimuthAngle={Math.PI / 2.5}
          target={[0, 1.2, -1]}
        />
      </Canvas>
    </div>
  );
}
