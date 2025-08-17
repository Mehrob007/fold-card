"use client";
import { useState } from "react";

export default function FoldCard() {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / 10).toFixed(2); 
    const rotateY = (x / 10).toFixed(2);
 
    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `rotateX(0deg) rotateY(0deg)`,
    });
  };

  return (
    <div
      className="fold-card"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h2>Fold Card</h2>
    </div>
  );
}
