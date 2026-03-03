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
// Adjust `ceilingY` to match your room's actual ceiling height.
const CEILING_Y = 3.2;
const CEILING_SIZE = 14; // wide enough to cover the classroom footprint

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
        These lights live OUTSIDE Suspense so they're always active — even
        while the EXR / GLB are still streaming in. Without this you get a
        completely dark scene until the assets finish loading.
      */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} color="#fff8ee" />
      <pointLight position={[-3, 3, -2]} intensity={1.5} color="#c8dfff" />

      {/*
        Suspense boundary: model + EXR load in the background.
        The lights above keep things visible in the meantime.
      */}
      <Suspense fallback={null}>
        {/*
          EXR environment.
          - background={false}: we're INSIDE the room so the skybox is
            always hidden by the walls anyway — no point rendering it.
          - The EXR still works as full IBL (Image Based Lighting) which
            gives the materials realistic reflections and colour grading.
          - backgroundBlurriness only matters if you ever switch to background=true.
        */}
        <Environment
          files="/asset/exr/mainbg.exr"
          background={false}
          backgroundBlurriness={0.5}
        />

        {/* Room model */}
        <ClassroomModel />

        {/* Reflective ceiling */}
        <Ceiling />

        {/*
          Soft baked-style floor shadows.
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
