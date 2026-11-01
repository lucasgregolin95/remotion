import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PLATE_W = 1280;
const PLATE_H = 720;
const TRUCK_YARD = staticFile("truck-yard.webp");
const LOGISTICS_PARK = staticFile("logistics-park.webp");

// Subtle forward push-in. Everything inside is authored in plate pixels so
// overlays stay locked to the original image.
const PushIn: React.FC<{
  children: React.ReactNode;
  from: number;
  to: number;
  origin: string;
  drift: [number, number];
}> = ({ children, from, to, origin, drift }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const cover = Math.max(width / PLATE_W, height / PLATE_H);
  const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.05, 0.55, 1),
  });
  const scale = interpolate(t, [0, 1], [from, to]);
  const floatX = Math.sin(frame / 43) * 0.4;
  const floatY = Math.sin(frame / 57 + 1.1) * 0.3;

  return (
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
          transformOrigin: origin,
          transform: `translate(${t * drift[0] + floatX}px, ${t * drift[1] + floatY}px) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

type MovingVehicle = {
  // Vehicle footprint in the plate, as a rotated ellipse.
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  angle: number;
  // Where to borrow empty road from to fill the spot the vehicle leaves.
  patch: [number, number];
  // Total travel over the shot, in plate pixels (constant speed).
  travel: [number, number];
};

// Moves the vehicles that already exist in the plate: the original pixels are
// cut out and translated along their lane, and the vacated spot is filled
// with neighbouring empty road. No vehicle is redrawn or duplicated.
const PlateVehicles: React.FC<{ href: string; vehicles: MovingVehicle[] }> = ({
  href,
  vehicles,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / (durationInFrames - 1);

  return (
    <svg
      width={PLATE_W}
      height={PLATE_H}
      viewBox={`0 0 ${PLATE_W} ${PLATE_H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter id="vehicle-soft">
          <feGaussianBlur stdDeviation={0.7} />
        </filter>
        {vehicles.map((v, i) => (
          <React.Fragment key={i}>
            <mask id={`cover-${i}`} maskUnits="userSpaceOnUse">
              <ellipse
                cx={v.cx}
                cy={v.cy}
                rx={v.rx + 1.5}
                ry={v.ry + 1.5}
                transform={`rotate(${v.angle} ${v.cx} ${v.cy})`}
                fill="white"
                filter="url(#vehicle-soft)"
              />
            </mask>
            <mask id={`body-${i}`} maskUnits="userSpaceOnUse">
              <ellipse
                cx={v.cx}
                cy={v.cy}
                rx={v.rx}
                ry={v.ry}
                transform={`rotate(${v.angle} ${v.cx} ${v.cy})`}
                fill="white"
                filter="url(#vehicle-soft)"
              />
            </mask>
          </React.Fragment>
        ))}
      </defs>
      {vehicles.map((v, i) => (
        <g key={`c${i}`} mask={`url(#cover-${i})`}>
          <image
            href={href}
            x={-v.patch[0]}
            y={-v.patch[1]}
            width={PLATE_W}
            height={PLATE_H}
          />
        </g>
      ))}
      {vehicles.map((v, i) => (
        <g
          key={`v${i}`}
          transform={`translate(${v.travel[0] * p} ${v.travel[1] * p})`}
        >
          <g mask={`url(#body-${i})`}>
            <image href={href} width={PLATE_W} height={PLATE_H} />
          </g>
        </g>
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shot 1: truck yard — leaf shadows sway, clouds drift, slow push-in.
// ---------------------------------------------------------------------------

const SHADOW_PATH =
  "M290 720 L380 618 L640 545 L1000 485 L1280 455 L1280 720 Z";
const SKY_PATH = "M0 0 L1280 0 L1280 268 L0 268 Z";

export const TruckYardShot: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#7aa7d8", overflow: "hidden" }}>
      <PushIn from={1.03} to={1.1} origin="55% 52%" drift={[0, 6]}>
        <Img
          src={TRUCK_YARD}
          style={{ position: "absolute", width: PLATE_W, height: PLATE_H }}
        />
        <DriftingSky />
        <SwayingLeafShadows />
      </PushIn>
      <SoftGrade />
    </AbsoluteFill>
  );
};

const DriftingSky: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const dx = interpolate(frame, [0, durationInFrames], [0, -7]);

  return (
    <svg
      width={PLATE_W}
      height={PLATE_H}
      viewBox={`0 0 ${PLATE_W} ${PLATE_H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter id="sky-feather">
          <feGaussianBlur stdDeviation={8} />
        </filter>
        <mask id="sky" maskUnits="userSpaceOnUse">
          <path d={SKY_PATH} fill="white" filter="url(#sky-feather)" />
        </mask>
      </defs>
      <g mask="url(#sky)">
        <image
          href={TRUCK_YARD}
          x={dx}
          width={PLATE_W}
          height={PLATE_H}
        />
      </g>
    </svg>
  );
};

const SwayingLeafShadows: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;

  return (
    <svg
      width={PLATE_W}
      height={PLATE_H}
      viewBox={`0 0 ${PLATE_W} ${PLATE_H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter
          id="sway"
          filterUnits="userSpaceOnUse"
          x={-200}
          y={-200}
          width={PLATE_W + 400}
          height={PLATE_H + 400}
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.022"
            numOctaves={2}
            seed={4}
            result="noise"
          />
          <feOffset
            in="noise"
            dx={Math.sin(s * 1.4) * 14 + Math.sin(s * 3.1) * 4}
            dy={Math.cos(s * 1.1) * 9}
            result="moving"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="moving"
            scale={4}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="shadow-feather">
          <feGaussianBlur stdDeviation={10} />
        </filter>
        <mask id="shadows" maskUnits="userSpaceOnUse">
          <path d={SHADOW_PATH} fill="white" filter="url(#shadow-feather)" />
        </mask>
      </defs>
      <g mask="url(#shadows)">
        <image
          href={TRUCK_YARD}
          width={PLATE_W}
          height={PLATE_H}
          filter="url(#sway)"
        />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shot 2: logistics park — existing vehicles drive along their roads.
// ---------------------------------------------------------------------------

const PARK_VEHICLES: MovingVehicle[] = [
  // Freight truck in the service lane beside the queued trailers.
  { cx: 784.5, cy: 385, rx: 15, ry: 7, angle: 69, patch: [14, 33], travel: [8, 21] },
  // Cars on the access road (left). The two queued cars further down stay put.
  { cx: 202, cy: 336.5, rx: 6, ry: 4, angle: 33, patch: [-14, -8.5], travel: [13, 8.5] },
  { cx: 213.6, cy: 377.1, rx: 7.5, ry: 5, angle: 31, patch: [17, 10.3], travel: [14, 8.5] },
  { cx: 217.9, cy: 395.7, rx: 8, ry: 5, angle: 31, patch: [19.9, 9.6], travel: [14, 8.5] },
  // Small vehicles crossing the central apron.
  { cx: 605, cy: 196.4, rx: 2.5, ry: 4, angle: -12, patch: [-8, 0], travel: [-1.5, -9] },
  { cx: 625, cy: 226, rx: 2.5, ry: 4, angle: -12, patch: [8, 0], travel: [2, 10] },
  { cx: 652, cy: 218, rx: 2.5, ry: 4, angle: -12, patch: [-8, 0], travel: [-1.5, -8] },
];

export const LogisticsParkShot: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#203024", overflow: "hidden" }}>
      <PushIn from={1.03} to={1.1} origin="52% 46%" drift={[0, 5]}>
        <Img
          src={LOGISTICS_PARK}
          style={{ position: "absolute", width: PLATE_W, height: PLATE_H }}
        />
        <PlateVehicles href={LOGISTICS_PARK} vehicles={PARK_VEHICLES} />
      </PushIn>
      <SoftGrade />
    </AbsoluteFill>
  );
};

const SoftGrade: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 80% 75% at 52% 48%, rgba(0,0,0,0) 60%, rgba(0,10,20,0.28) 100%)",
      }}
    />
  );
};
