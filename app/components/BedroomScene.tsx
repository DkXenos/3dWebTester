'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import Scene from './Scene';

// Sets scene background + gl clear colour to black so there's never a white frame
function BlackBackground() {
  const { scene, gl } = useThree();
  useEffect(() => {
    gl.setClearColor(new THREE.Color('#000000'), 1);
    // scene.background will be overwritten by <Environment background> once loaded
    scene.background = new THREE.Color('#000000');
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
        background: '#000000',
      }}
    >
      <Canvas
        shadows="soft"
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        // Camera positioned slightly inside the room, angled slightly
        // toward the windowed wall so the EXR is immediately visible
        camera={{
          fov: 75,
          near: 0.05,
          far: 100,
          position: [0, 1.5, 3],
        }}
      >
        <BlackBackground />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={false}
          rotateSpeed={0.3}
          zoomSpeed={0.5}
          minDistance={0.5}
          maxDistance={6}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.6}
          target={[0, 1.0, 0]}
        />
      </Canvas>
    </div>
  );
}
