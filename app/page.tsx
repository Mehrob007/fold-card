// import FoldCard from "@/src/ui/FoldCard";
// import React from "react";
// import "@/src/styles/globalStyles.css";
// import Image from "next/image";
// import imgCursor from "@/public/Кнопка.svg";
// import Module3D from "@/src/ui/Module3D";

// export default function page() {
//   return (
//     <div>
//       <FoldCard></FoldCard>
//       <FoldCard></FoldCard>
//       <Module3D />
//     </div>
//   );
// }

"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Group, TextureLoader } from "three";
import { GLTFLoader } from "three-stdlib";

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

export default function ModelViewer() {
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
