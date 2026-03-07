'use client';

import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

// ─── Classroom model ─────────────────────────────────────────────────────────
function ClassroomModel() {
  const { scene } = useGLTF('/asset/3d/computer_classroom.glb');

  useEffect(() => {
    const worldBox = new THREE.Box3();
    const size     = new THREE.Vector3();
    const center   = new THREE.Vector3();

    // Collect candidates for glass
    const candidates: { name: string; sx: number; sy: number; sz: number; cy: number }[] = [];

    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;

      // Fix colour space
      const rawMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      rawMats.forEach((mat) => {
        if (!mat) return;
        const m = mat as THREE.MeshStandardMaterial;
        if (m.map)         m.map.colorSpace         = THREE.SRGBColorSpace;
        if (m.emissiveMap) m.emissiveMap.colorSpace  = THREE.SRGBColorSpace;
      });

      // World bounding box
      worldBox.setFromObject(mesh);
      worldBox.getSize(size);
      worldBox.getCenter(center);

      const sx = size.x, sy = size.y, sz = size.z;
      const cy = center.y;

      candidates.push({ name: mesh.name, sx, sy, sz, cy });
    });

    // Log ALL meshes sorted by height for easy reading
    const sorted = [...candidates].sort((a, b) => b.sy - a.sy);
    console.log('[Meshes by height]', JSON.stringify(
      sorted.map(c => `${c.name}:${c.sx.toFixed(2)}x${c.sy.toFixed(2)}x${c.sz.toFixed(2)}@cy${c.cy.toFixed(2)}`)
    ));

    // ── Identify window-pane meshes ─────────────────────────────────────────
    // A window pane on a WALL is:
    //   - notably thin in ONE axis (X or Z < 0.15), OR thin in Y for ceiling windows
    //   - NOT tiny in the other two axes (area > 0.2)
    //   - positioned in the upper half of the room (cy > 0.8)
    //
    // Hardcoded: Object_6 and Object_9 are confirmed window panes from profiling
    // (0.13x2.75x0.79, center y=1.74) — their X is 0.13 which is just above
    // the default 0.12 threshold, so we hardcode them to be safe.
    const KNOWN_GLASS = new Set(['Object_6', 'Object_9']);
    const glassMeshNames = new Set<string>();

    candidates.forEach(({ name, sx, sy, sz, cy }) => {
      const thinX = sx < 0.15;
      const thinZ = sz < 0.15;
      const thinY = sy < 0.12;
      const areaXY = sx * sy;
      const areaZY = sz * sy;
      const areaXZ = sx * sz;
      const isLargeEnough = areaXY > 0.12 || areaZY > 0.12 || areaXZ > 0.12;
      const isUpperRoom   = cy > 0.8;

      if (KNOWN_GLASS.has(name) || (isUpperRoom && isLargeEnough && (thinX || thinZ || thinY))) {
        glassMeshNames.add(name);
      }
    });

    console.log('[Candidate glass meshes]', JSON.stringify([...glassMeshNames]));

    // ── Apply glass material (CLONED) to identified panes only ─────────────
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      if (!glassMeshNames.has(mesh.name)) return;

      const rawMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const clonedMats = rawMats.map((mat) => {
        if (!mat) return mat;
        const clone = (mat as THREE.MeshStandardMaterial).clone();
        clone.transparent     = true;
        clone.opacity         = 0.08;
        clone.roughness       = 0.0;
        clone.metalness       = 0.05;
        clone.envMapIntensity = 0.0;
        clone.color.set('#c8dff0');
        clone.depthWrite      = false;
        clone.needsUpdate     = true;
        return clone;
      });

      mesh.material = clonedMats.length === 1 ? clonedMats[0] : clonedMats;
      console.log('[Glass applied]', mesh.name);
    });
  }, [scene]);

  return (
    <primitive object={scene} rotation={[0, Math.PI, 0]} />
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────
export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />

      <Suspense fallback={null}>
        <ClassroomModel />
      </Suspense>
    </>
  );
}

useGLTF.preload('/asset/3d/computer_classroom.glb');
