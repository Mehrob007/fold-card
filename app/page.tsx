"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Group, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Типизация для useGLTF
type GLTFResult = {
  scene: Group;
};

function Model({ file }: { file: File | null }) {
  const [scene, setScene] = useState<Group | null>(null);

  useEffect(() => {
    if (!file) return;

    const loader = new GLTFLoader();
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      loader.parse(arrayBuffer, "", (gltf) => {
        setScene(gltf.scene);
      });
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  if (!scene) return null;
  return <primitive object={scene} scale={1} />;
}

function Background() {
  const { scene } = useThree();
  const texture = useLoader(TextureLoader, "/bg-img.jpg");

  useEffect(() => {
    scene.background = texture;
    return () => {
      scene.background = null;
    };
  }, [texture, scene]);

  return null;
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* загрузчик файла */}
      <input
        type="file"
        accept=".glb,.gltf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{ position: "absolute", zIndex: 10, top: 10, left: 10 }}
      />

      <Canvas style={{ height: "100%", width: "100%" }}>
        <Suspense fallback={null}>
          <Background />
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 2, 2]} intensity={1.2} />
          <directionalLight position={[-2, -2, -2]} intensity={0.5} />
          {file && <Model file={file} />}
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
