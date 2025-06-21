"use client";
import { useRef, useEffect, useState } from "react";

const BALL_SIZE = 84; // 120 * 0.7 ≈ 84 (soit -30%)

export default function BaseballBalle() {
  const pos = useRef({ x: 100, y: 100 });
  const vel = useRef({ dx: 0, dy: 0 });
  const speed = useRef(0);
  const lastMove = useRef(Date.now());
  const [tick, setTick] = useState(0);

  // Animation loop
  useEffect(() => {
    let frame: number;
    function animate() {
      let { x, y } = pos.current;
      let { dx, dy } = vel.current;
      let v = speed.current;

      if (v > 0.01) {
        x += dx * v;
        y += dy * v;

        const w = window.innerWidth;
        const h = window.innerHeight;
        if (x <= 0 && dx < 0) dx = -dx;
        if (x + BALL_SIZE >= w && dx > 0) dx = -dx;
        if (y <= 0 && dy < 0) dy = -dy;
        if (y + BALL_SIZE >= h && dy > 0) dy = -dy;

        v = Math.max(0, v * 0.983);

        pos.current = { x, y };
        vel.current = { dx, dy };
        speed.current = v;
        setTick(t => t + 1);
      }
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const ballCenter = {
      x: rect.left + BALL_SIZE / 2,
      y: rect.top + BALL_SIZE / 2,
    };
    const dirX = e.clientX - ballCenter.x;
    const dirY = e.clientY - ballCenter.y;
    const norm = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    let dx = dirX / norm;
    let dy = dirY / norm;
    if (speed.current < 0.1) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
    }
    vel.current = { dx, dy };
    speed.current = Math.min(speed.current + 3, 22);
    lastMove.current = Date.now();
    setTick(t => t + 1);
  }

  useEffect(() => {
    const stopInterval = setInterval(() => {
      if (speed.current > 0.01 && Date.now() - lastMove.current > 1800) {
        speed.current = speed.current * 0.965;
      }
    }, 500);
    return () => clearInterval(stopInterval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.current.x,
        top: pos.current.y,
        width: BALL_SIZE,
        height: BALL_SIZE,
        cursor: "pointer",
        zIndex: 40,
        userSelect: "none",
        transition: "box-shadow 0.2s",
      }}
      onMouseMove={handleMouseMove}
      title="Attrape-moi si tu peux !"
      className="select-none"
    >
      <div
        className="w-full h-full flex items-center justify-center text-[58px] md:text-[70px] drop-shadow-lg"
        style={{
          borderRadius: "50%",
          background: "radial-gradient(circle at 65% 35%, #fff 90%, #fca5a5 100%)",
          boxShadow: "0 8px 30px 0 rgba(255,0,0,0.13), 0 1.5px 3px #e11d48",
        }}
      >
        <span
          style={{
            display: "inline-block",
            // Rotation beaucoup plus lente (divisé par 4)
            transform: `rotate(${tick * speed.current * 0.75}deg)`,
            transition: "transform 0.16s",
          }}
        >
          ⚾️
        </span>
      </div>
    </div>
  );
}
