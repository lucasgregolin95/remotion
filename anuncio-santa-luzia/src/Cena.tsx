import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Audio} from '@remotion/media';
import {Cena, ENTRADA_VOZ, Movimento} from './cenas';

export const COR = {
  ouro: '#E2C28E',
  ouroForte: '#C9A46A',
  creme: '#F7F2EA',
  carvao: '#121212',
};
export const SERIFA = 'Playfair Display';
export const SANS = 'Montserrat';

// Correção de cor final aplicada sobre as fotos já tratadas.
const FILTRO_FOTO = 'contrast(1.03) saturate(1.04)';

const progressoMovimento = (frame: number, duracao: number) =>
  interpolate(frame, [0, duracao], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });

// Câmera virtual: zoom e panorâmica sem expor as bordas da foto e sem distorção
// (escala sempre uniforme; o deslocamento é limitado à sobra gerada pelo zoom).
export const transformacaoCamera = (
  movimento: Movimento,
  frame: number,
  duracao: number,
) => {
  const p = progressoMovimento(frame, duracao);
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
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
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
        textShadow: '0 4px 28px rgba(0,0,0,0.55)',
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
              translate: `0 ${(1 - s) * 40}px`,
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

// Legenda sincronizada: aparece com a voz e some quando a fala termina.
export const Legenda: React.FC<{readonly texto: string; readonly duracaoVoz: number}> = ({
  texto,
  duracaoVoz,
}) => {
  const frame = useCurrentFrame();
  const inicio = ENTRADA_VOZ - 2;
  const fim = ENTRADA_VOZ + duracaoVoz + 6;
  const opacidade = interpolate(frame, [inicio, inicio + 5, fim - 5, fim], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        bottom: 340,
        display: 'flex',
        justifyContent: 'center',
        opacity: opacidade,
        translate: `0 ${(1 - opacidade) * 16}px`,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.3,
          color: '#FFFFFF',
          background: 'rgba(12,12,12,0.68)',
          borderRadius: 20,
          padding: '20px 30px',
          textAlign: 'center',
          maxWidth: 920,
          textWrap: 'balance',
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// A voz entra quando a transição de entrada termina.
export const Narracao: React.FC<{readonly id: string}> = ({id}) => (
  <Sequence name={`Narração ${id}`} from={ENTRADA_VOZ} layout="none">
    <Audio src={staticFile(`narracao/${id}.wav`)} />
  </Sequence>
);

export const CenaFoto: React.FC<{readonly cena: Cena; readonly duracao: number}> = ({
  cena,
  duracao,
}) => {
  const frame = useCurrentFrame();
  const cta = !cena.legenda;
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
              'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.62) 75%)',
          }}
        />
      ) : (
        <>
          <AbsoluteFill
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 22%, rgba(0,0,0,0.0) 40%)',
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.0) 32%)',
            }}
          />
        </>
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
          <Kicker texto={cena.ambiente} atraso={4} />
          <Titulo texto={cena.titulo} atraso={ENTRADA_VOZ} tamanho={104} alinhamento="center" />
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
          <Kicker texto={cena.ambiente} atraso={4} />
          <Titulo texto={cena.titulo} atraso={8} tamanho={92} alinhamento="left" />
        </div>
      )}
      {cena.legenda ? <Legenda texto={cena.narracao} duracaoVoz={cena.vozFrames} /> : null}
    </AbsoluteFill>
  );
};
