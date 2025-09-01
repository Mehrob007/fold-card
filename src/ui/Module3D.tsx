
"use client";

import React, { Suspense, useEffect } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Group, TextureLoader } from "three";

// Типизация для useGLTF
type GLTFResult = {
  scene: Group;
};

function Model(props: JSX.IntrinsicElements["primitive"]) {
  const { scene } = useGLTF("/cube7_1.glb") as GLTFResult;

  // Диагностика: проверяем материалы и текстуры
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        console.log("Материал:", child.material.name, child.material);
        if (child.material.map) {
          console.log("Текстура:", child.material.map.sourceFile || "без имени");
        } else {
          console.log("Текстура отсутствует для материала:", child.material.name);
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
}

useGLTF.preload("/cube7_1.glb");

// Компонент для фона
function Background() {
  const { scene } = useThree();
  const texture = useLoader(TextureLoader, "/bg-img.jpg");

  useEffect(() => {
    scene.background = texture; // Устанавливаем текстуру как фон сцены
    return () => {
      scene.background = null; // Очищаем при размонтировании
    };
  }, [texture, scene]);

  return null;
}

export default function ModelViewer() {
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <Suspense fallback={null}>
        <Background />
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} />
        <directionalLight position={[-2, -2, -2]} intensity={0.5} />
        <Model scale={1} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
