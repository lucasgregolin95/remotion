import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Source plate dimensions (the reference image). Every overlay is authored in
// these coordinates so it stays locked to the plate while the camera moves.
const PLATE_W = 1672;
const PLATE_H = 941;
const PLATE = staticFile("port.webp");

// Water surface, excluding the quays, the container ship and the far vessels.
const WATER_PATH =
  "M0 505 L200 500 L460 498 L1000 442 L1310 384 L1480 368 L1672 340 L1672 941 L0 941 Z";
const SHIP_PATH =
  "M1068 700 L1078 630 L1120 560 L1200 505 L1282 470 L1292 420 L1365 412 L1425 465 L1422 560 L1385 615 L1300 705 L1215 770 L1165 818 L1118 808 Z";
const FAR_SHIP_PATH = "M1480 290 L1620 290 L1620 362 L1480 362 Z";
const TUG_PATH = "M1010 392 L1100 392 L1100 420 L1010 420 Z";

type Vehicle = {
  from: [number, number];
  to: [number, number];
  progress: number;
  speed: number;
  cab: string;
  trailer: string;
  length: number;
};

// Trucks running along the existing quay apron and the landside access road.
// Speeds are in plate pixels per second (~ 15-25 km/h at this scale).
const VEHICLES: Vehicle[] = [
  { from: [440, 478], to: [990, 424], progress: 0.12, speed: 4.2, cab: "#f2f2ee", trailer: "#2a5c9a", length: 7 },
  { from: [990, 424], to: [440, 478], progress: 0.38, speed: 3.6, cab: "#d8452f", trailer: "#5a5f66", length: 7 },
  { from: [440, 478], to: [990, 424], progress: 0.62, speed: 4.8, cab: "#e9e6dc", trailer: "#b5452c", length: 6.5 },
  { from: [990, 424], to: [440, 478], progress: 0.84, speed: 4.0, cab: "#3b6db3", trailer: "#d9d6cc", length: 7 },
  { from: [236, 428], to: [432, 463], progress: 0.2, speed: 3.2, cab: "#ffffff", trailer: "#ffffff", length: 4.5 },
  { from: [432, 463], to: [236, 428], progress: 0.65, speed: 3.0, cab: "#2b2f36", trailer: "#2b2f36", length: 4.5 },
  { from: [1180, 377], to: [1350, 356], progress: 0.3, speed: 3.4, cab: "#f0efe8", trailer: "#7a8794", length: 5.5 },
];

export const MyComposition = () => {
  return (
    <Composition
      id="PortDroneFlight"
      component={PortDroneFlight}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

export const PortDroneFlight: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1a2a", overflow: "hidden" }}>
      <CameraRig>
        <Img
          src={PLATE}
          style={{ position: "absolute", width: PLATE_W, height: PLATE_H }}
        />
        <WaterSurface />
        <Vehicles />
        <SunGlow />
      </CameraRig>
      <AtmosphericHaze />
      <Grade />
    </AbsoluteFill>
  );
};

// Slow forward flight with a gentle climb: a continuous dolly-in towards the
// terminal while the vantage point rises (the scene drifts down in frame and
// the ground plane opens up slightly).
const CameraRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const cover = Math.max(width / PLATE_W, height / PLATE_H);
  const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.05, 0.55, 1),
  });

  const dolly = interpolate(t, [0, 1], [1.045, 1.17]);
  const rise = interpolate(t, [0, 1], [-14, 22]);
  const drift = interpolate(t, [0, 1], [6, -10]);
  const tilt = interpolate(t, [0, 1], [0, 2.2]);
  // Very low-amplitude, low-frequency stabilised-gimbal float.
  const floatX = Math.sin(frame / 41) * 0.6;
  const floatY = Math.sin(frame / 53 + 1.3) * 0.45;
  const roll = Math.sin(frame / 67) * 0.04;

  return (
    <AbsoluteFill style={{ perspective: 2600, perspectiveOrigin: "58% 30%" }}>
      <div
        style={{
          position: "absolute",
          left: (width - PLATE_W * cover) / 2,
          top: (height - PLATE_H * cover) / 2,
          width: PLATE_W,
          height: PLATE_H,
          transformOrigin: "0 0",
          scale: String(cover),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "60% 42%",
            transform: `translate(${drift + floatX}px, ${rise + floatY}px) rotateX(${tilt}deg) rotate(${roll}deg) scale(${dolly})`,
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Animated ripple displacement of the water only — quays, ships and every
// structure stay pixel-identical to the plate.
const WaterSurface: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  return (
    <svg
      width={PLATE_W}
      height={PLATE_H}
      viewBox={`0 0 ${PLATE_W} ${PLATE_H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter
          id="ripple"
          filterUnits="userSpaceOnUse"
          x={-300}
          y={-100}
          width={PLATE_W + 600}
          height={PLATE_H + 200}
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.045"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feOffset
            in="noise"
            dx={-seconds * 26}
            dy={seconds * 7}
            result="moving"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="moving"
            scale={5}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="feather">
          <feGaussianBlur stdDeviation={6} />
        </filter>
        <mask id="water" maskUnits="userSpaceOnUse">
          <g filter="url(#feather)">
            <path d={WATER_PATH} fill="white" />
            <path d={SHIP_PATH} fill="black" />
            <path d={FAR_SHIP_PATH} fill="black" />
            <path d={TUG_PATH} fill="black" />
          </g>
        </mask>
      </defs>
      <g mask="url(#water)">
        <image
          href={PLATE}
          width={PLATE_W}
          height={PLATE_H}
          filter="url(#ripple)"
        />
      </g>
    </svg>
  );
};

const Vehicles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  return (
    <svg
      width={PLATE_W}
      height={PLATE_H}
      viewBox={`0 0 ${PLATE_W} ${PLATE_H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      {VEHICLES.map((v, i) => {
        const dx = v.to[0] - v.from[0];
        const dy = v.to[1] - v.from[1];
        const len = Math.hypot(dx, dy);
        const p = (v.progress + (v.speed * seconds) / len) % 1;
        const x = v.from[0] + dx * p;
        const y = v.from[1] + dy * p;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        // Fade in/out at the ends of the route so nothing pops.
        const opacity = interpolate(p, [0, 0.06, 0.94, 1], [0, 1, 1, 0]);
        const cabLen = v.length * 0.28;
        return (
          <g
            key={i}
            opacity={opacity * 0.92}
            transform={`translate(${x} ${y}) rotate(${angle})`}
          >
            <rect
              x={-v.length / 2 - 0.6}
              y={0.4}
              width={v.length + 1.2}
              height={2.6}
              fill="rgba(10,20,30,0.35)"
              rx={0.6}
            />
            <rect
              x={-v.length / 2}
              y={-1.2}
              width={v.length - cabLen - 0.4}
              height={2.4}
              fill={v.trailer}
              rx={0.3}
            />
            <rect
              x={v.length / 2 - cabLen}
              y={-1.1}
              width={cabLen}
              height={2.2}
              fill={v.cab}
              rx={0.4}
            />
          </g>
        );
      })}
    </svg>
  );
};

// Gentle breathing of the low sun and its specular path on the water.
const SunGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 23);
  const sparkle = 0.5 + 0.5 * Math.sin(frame / 7.3 + 0.8);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 1492 - 260,
          top: 218 - 260,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,214,140,0.55) 0%, rgba(255,170,80,0.18) 30%, rgba(255,140,60,0) 65%)",
          mixBlendMode: "screen",
          opacity: 0.55 + pulse * 0.2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1400,
          top: 340,
          width: 190,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,200,120,0.5) 0%, rgba(255,170,90,0) 70%)",
          mixBlendMode: "screen",
          filter: "blur(6px)",
          opacity: 0.25 + sparkle * 0.15,
        }}
      />
    </>
  );
};

// Thin warm haze layers drifting across the hills and the far shore.
const AtmosphericHaze: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const shift = interpolate(frame, [0, durationInFrames], [0, -60]);
  const shift2 = interpolate(frame, [0, durationInFrames], [0, 40]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          translate: `${shift}px 0px`,
          left: -100,
          right: -100,
          background:
            "radial-gradient(ellipse 40% 9% at 35% 31%, rgba(255,236,210,0.14), rgba(255,236,210,0) 100%), radial-gradient(ellipse 35% 7% at 78% 29%, rgba(255,200,150,0.16), rgba(255,200,150,0) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          translate: `${shift2}px 0px`,
          left: -100,
          right: -100,
          background:
            "radial-gradient(ellipse 30% 5% at 55% 36%, rgba(230,240,255,0.10), rgba(230,240,255,0) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Restrained cinematic grade: soft vignette and a gentle warm/cool split.
const Grade: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,40,80,0.06) 0%, rgba(0,0,0,0) 40%, rgba(5,25,45,0.10) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 55% 45%, rgba(0,0,0,0) 55%, rgba(0,8,18,0.38) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
