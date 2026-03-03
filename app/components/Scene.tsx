'use client';

import { Suspense, useEffect } from 'react';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// ─── Classroom model ────────────────────────────────────────────────────────
function ClassroomModel() {
  const { scene } = useGLTF('/asset/3d/computer_classroom.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // No castShadow on mesh lights — ContactShadows handles shadows
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} rotation={[0, Math.PI, 0]} />;
}

// ─── Ceiling plane ───────────────────────────────────────────────────────────
// Sits at the top of the room walls and subtly reflects EXR city lights.
const CEILING_Y = 3.2;
const CEILING_SIZE = 14;

function Ceiling() {
  return (
    <mesh
      position={[0, CEILING_Y, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[CEILING_SIZE, CEILING_SIZE]} />
      <meshStandardMaterial
        color="#c8c8c8"
        roughness={0.3}
        metalness={0.0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Full scene composition ──────────────────────────────────────────────────
export default function Scene() {
  return (
    <>
      {/*
        Very low ambient so true blacks don't get too dark.
        Lives OUTSIDE Suspense so it's always active while EXR/GLB stream in.
      */}
      <ambientLight intensity={0.2} />

      {/*
        Suspense boundary: model + EXR load in the background.
      */}
      <Suspense fallback={null}>
        {/*
          EXR environment with background enabled.
          - background={true}: renders the blurred EXR as the scene skybox.
          - blur={0.5}: hides 1k pixelation for a cinematic "bokeh city" look.
          - Still provides full IBL for realistic reflections & colour grading.
        */}
        <Environment
          files="/asset/exr/mainbg.exr"
          background
          blur={0.5}
          environmentIntensity={0.4}
        />

        {/* Room model */}
        <ClassroomModel />

        {/* Reflective ceiling — subtly catches city lights from the EXR */}
        <Ceiling />

        {/*
          Soft baked-style floor shadows — no castShadow on lights needed.
          Adjust position y to sit exactly on the floor of your model.
        */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.6}
          blur={2}
          scale={20}
          far={5}
          resolution={512}
          color="#000000"
        />
      </Suspense>
    </>
  );
}

useGLTF.preload('/asset/3d/computer_classroom.glb');
