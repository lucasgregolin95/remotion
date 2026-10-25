import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Cena, Movimento} from './cenas';

export const COR = {
  ouro: '#E2C28E',
  ouroForte: '#C9A46A',
  creme: '#F7F2EA',
  carvao: '#121212',
};
export const SERIFA = 'Playfair Display';
export const SANS = 'Montserrat';

// Correção de cor final aplicada sobre as fotos já tratadas.
export const FILTRO_FOTO = 'contrast(1.03) saturate(1.04)';

// Câmera virtual: zoom e panorâmica sem expor as bordas da foto e sem distorção
// (escala sempre uniforme; o deslocamento é limitado à sobra gerada pelo zoom).
export const transformacaoCamera = (
  movimento: Movimento,
  frame: number,
  duracao: number,
) => {
  const p = interpolate(frame, [0, duracao], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const zoom = interpolate(p, [0, 1], movimento.zoom);
  const limite = ((zoom - 1) / (2 * zoom)) * 100;
  const x = Math.max(-limite, Math.min(limite, interpolate(p, [0, 1], movimento.x)));
  const y = Math.max(-limite, Math.min(limite, interpolate(p, [0, 1], movimento.y)));
  return `scale(${zoom}) translate(${x}%, ${y}%)`;
};

export const Kicker: React.FC<{readonly texto: string; readonly atraso: number}> = ({
  texto,
  atraso,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - atraso, fps, config: {damping: 200}});
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        opacity: s,
        translate: `${(1 - s) * -30}px 0`,
      }}
    >
      <div style={{width: 64 * s, height: 4, background: COR.ouro, borderRadius: 2}} />
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 7,
          textTransform: 'uppercase',
          color: COR.ouro,
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}
      >
        {texto}
      </div>
    </div>
  );
};

export const Titulo: React.FC<{
  readonly texto: string;
  readonly atraso: number;
  readonly tamanho: number;
  readonly alinhamento: 'left' | 'center';
}> = ({texto, atraso, tamanho, alinhamento}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const palavras = texto.split(' ');
  return (
    <div
      style={{
        fontFamily: SERIFA,
        fontWeight: 700,
        fontSize: tamanho,
        lineHeight: 1.08,
        color: '#FFFFFF',
        textAlign: alinhamento,
        textShadow: '0 4px 28px rgba(0,0,0,0.6)',
        textWrap: 'balance',
      }}
    >
      {palavras.map((palavra, i) => {
        const s = spring({
          frame: frame - atraso - i * 2,
          fps,
          config: {damping: 200},
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: s,
              translate: `0 ${(1 - s) * 36}px`,
              marginRight: i === palavras.length - 1 ? 0 : '0.25em',
            }}
          >
            {palavra}
          </span>
        );
      })}
    </div>
  );
};

// Cena de foto em tela cheia. `inicio` é o frame do vídeo em que a sequência começa,
// usado para converter `tituloEm` (tempo absoluto) em tempo local.
export const CenaFoto: React.FC<{
  readonly cena: Cena;
  readonly duracao: number;
  readonly inicio: number;
}> = ({cena, duracao, inicio}) => {
  const frame = useCurrentFrame();
  const cta = cena.tipo === 'cta';
  const atrasoTitulo = cena.tituloEm - inicio;
  return (
    <AbsoluteFill style={{backgroundColor: COR.carvao, overflow: 'hidden'}}>
      <Img
        src={staticFile(cena.foto)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: transformacaoCamera(cena.movimento, frame, duracao),
          filter: FILTRO_FOTO,
        }}
      />
      {cta ? (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.64) 75%)',
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 22%, rgba(0,0,0,0.0) 40%)',
          }}
        />
      )}
      {cta ? (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 90px',
            gap: 36,
          }}
        >
          <Kicker texto={cena.kicker} atraso={4} />
          <Titulo texto={cena.titulo} atraso={atrasoTitulo} tamanho={100} alinhamento="center" />
        </AbsoluteFill>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 210,
            left: 80,
            right: 80,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <Kicker texto={cena.kicker} atraso={4} />
          <Titulo texto={cena.titulo} atraso={atrasoTitulo} tamanho={92} alinhamento="left" />
        </div>
      )}
    </AbsoluteFill>
  );
};
