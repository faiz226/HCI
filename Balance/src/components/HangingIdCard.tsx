"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const GRAVITY = 3000;
const DAMPING = 0.9;
const MASS = 1;
const SPRING_K = 0;

type CardPhysicsState = { angle: number; vel: number };

export type HangingIdCardProps = {
  name: string;
  role?: string;
  badgeId?: string;
  accentColor?: string;
  className?: string;
};

function Lanyard({ length, color }: { length: number; color: string }) {
  return (
    <svg
      width="30"
      height={length}
      viewBox={`0 0 30 ${length}`}
      style={{ display: "block", margin: "0 auto", overflow: "visible" }}
      aria-hidden
    >
      <circle cx="15" cy="0" r="5" fill={color} />
      <path d={`M 13 0 L 10 ${length}`} stroke={color} strokeWidth="6" opacity="0.9" />
      <path d={`M 17 0 L 20 ${length}`} stroke={color} strokeWidth="6" opacity="0.9" />
      <rect x="10" y={length - 6} width="10" height="8" rx="2" fill="#94a3b8" />
      <circle cx="15" cy={length + 2} r="3" fill="#e2e8f0" />
    </svg>
  );
}

export function HangingIdCard({
  name,
  role = "KICT Student",
  badgeId = "SO-2026",
  accentColor = "#536251",
  className,
}: HangingIdCardProps) {
  const ropeLength = 110;
  const physRef = useRef<CardPhysicsState>({ angle: 0, vel: 0 });
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const prevAngleRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragAngle0 = useRef(0);

  const [angle, setAngle] = useState(0);

  const tick = useCallback(
    (now: number) => {
      if (prevTimeRef.current === null) prevTimeRef.current = now;
      const dt = Math.min((now - prevTimeRef.current) / 1000, 0.05);
      prevTimeRef.current = now;

      const s = physRef.current;
      if (!isDraggingRef.current) {
        const L = ropeLength + 100;
        const torque =
          -(GRAVITY / L) * Math.sin(s.angle) -
          (DAMPING / MASS) * s.vel -
          (SPRING_K / MASS) * s.angle;
        s.vel += torque * dt;
        s.angle += s.vel * dt;
        setAngle(s.angle);
        if (Math.abs(s.angle) > 0.001 || Math.abs(s.vel) > 0.001) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          s.angle = 0;
          s.vel = 0;
          setAngle(0);
        }
      } else {
        if (dt > 0) s.vel = (s.angle - prevAngleRef.current) / dt;
        prevAngleRef.current = s.angle;
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [ropeLength],
  );

  const startPhysics = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    prevTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      dragStartX.current = e.clientX;
      dragAngle0.current = physRef.current.angle;
      prevAngleRef.current = physRef.current.angle;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      prevTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartX.current;
      const L = ropeLength + 100;
      const clamped = Math.max(-1.4, Math.min(1.4, dragAngle0.current - dx / L));
      physRef.current.angle = clamped;
      setAngle(clamped);
    },
    [ropeLength],
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
    startPhysics();
  }, [startPhysics]);

  const onCardClick = useCallback(() => {
    if (Math.abs(physRef.current.vel) < 0.1 && Math.abs(physRef.current.angle) < 0.05) {
      physRef.current.vel = 4;
      startPhysics();
    }
  }, [startPhysics]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const cardRotateDeg = angle * (180 / Math.PI);

  return (
    <div className={cn("flex flex-col items-center select-none", className)} style={{ touchAction: "none" }}>
      <div className="relative z-10 h-3 w-3 rounded-full shadow-md" style={{ background: accentColor }} />
      <div
        className="flex cursor-grab flex-col items-center active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={onCardClick}
        style={{
          transform: `rotate(${cardRotateDeg}deg)`,
          transformOrigin: "top center",
          willChange: "transform",
          marginTop: "-6px",
        }}
      >
        <Lanyard length={ropeLength} color={accentColor} />
        <div className="relative mt-[-2px] w-52 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-white shadow-soft">
          <div
            className="flex flex-col items-center gap-1 px-4 py-3"
            style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #8a9a86 100%)` }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/70">
              Soft Oasis
            </p>
            <div className="mt-1 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 shadow-inner">
              <span className="material-symbols-outlined filled text-white text-[32px]">
                spa
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 px-4 py-4">
            <p className="text-center text-sm font-bold leading-tight text-on-surface">{name}</p>
            <p className="text-[11px] font-medium text-on-surface-variant">{role}</p>
            <div className="my-1 w-full border-t border-outline-variant/40" />
            <div className="flex h-7 items-end gap-[2px] px-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[1px] bg-on-surface/80"
                  style={{
                    width: i % 3 === 0 ? "3px" : "1.5px",
                    height: `${50 + Math.sin(i * 1.3) * 35}%`,
                  }}
                />
              ))}
            </div>
            <p className="mt-1 font-mono text-[10px] font-bold tracking-widest" style={{ color: accentColor }}>
              {badgeId}
            </p>
            <div
              className="mt-1 rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-on-primary"
              style={{ background: accentColor }}
            >
              Active
            </div>
          </div>
        </div>
      </div>
      <p className="pointer-events-none mt-6 select-none text-[11px] font-medium text-on-surface-variant">
        Drag or tap the card
      </p>
    </div>
  );
}
