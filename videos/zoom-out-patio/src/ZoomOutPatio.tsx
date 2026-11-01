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

export type ZoomOutPatioProps = {
  // Ponto da vista aérea que corresponde ao local da câmera na cena inicial
  // (pátio de concreto com sombras de árvores), em coordenadas normalizadas.
  readonly focoX: number;
  readonly focoY: number;
  // Quanto a vista aérea começa ampliada sobre esse ponto.
  readonly zoomInicial: number;
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const ZoomOutPatio: React.FC<ZoomOutPatioProps> = ({
  focoX,
  focoY,
  zoomInicial,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Plano 1: câmera no nível do chão. Começa a subir e inclinar para baixo,
  // acelerando em direção ao asfalto sombreado em primeiro plano.
  const subida = interpolate(t, [0, 4.1], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  // Leve aproximação contínua desde o primeiro quadro + aceleração final.
  const chaoEscala = 1 + (t / 4.1) * 0.04 + subida * 0.9;
  const chaoBlur = interpolate(t, [2.9, 4.1], [0, 14], clamp);
  const chaoOpacidade = interpolate(t, [3.2, 4.1], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });

  // Plano 2: vista aérea. Entra ampliada sobre o mesmo pátio e abre
  // (zoom out) até revelar todo o complexo logístico.
  const abertura = interpolate(t, [3.2, 10.4], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.55, 0.35, 1),
  });
  // Interpolação logarítmica: velocidade de câmera percebida constante.
  const aereoEscala = Math.exp(Math.log(zoomInicial) * (1 - abertura));
  const aereoRotacao = -3 * (1 - abertura);
  const aereoBlur = interpolate(t, [3.2, 4.6], [12, 0], clamp);
  const aereoOpacidade = interpolate(t, [3.2, 4.1], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#7f8a96" }}>
      <AbsoluteFill
        style={{
          opacity: aereoOpacidade,
          transform: `scale(${aereoEscala}) rotate(${aereoRotacao}deg)`,
          transformOrigin: `${focoX * 100}% ${focoY * 100}%`,
          filter: `blur(${aereoBlur}px)`,
        }}
      >
        <Img
          src={staticFile("final-5k.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {chaoOpacidade > 0 ? (
        <AbsoluteFill
          style={{
            opacity: chaoOpacidade,
            transform: `scale(${chaoEscala})`,
            transformOrigin: "50% 90%",
            filter: `blur(${chaoBlur}px)`,
          }}
        >
          <Img
            src={staticFile("inicial-8k.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      ) : null}

      {/* Vinheta suave para um acabamento cinematográfico */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(0,0,0,0.22) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
