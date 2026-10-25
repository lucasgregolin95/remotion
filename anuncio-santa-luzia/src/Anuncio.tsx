import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {loadFont} from '@remotion/fonts';
import {linearTiming, TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {CENAS, DURACAO_TOTAL, duracaoCena, JANELAS_DE_VOZ, TRANSICAO} from './cenas';
import {CenaFoto, COR, Narracao, SANS, SERIFA} from './Cena';
import {CenaAbertura, CenaEncerramento, CenaLocalizacao} from './CenasEspeciais';

const fontes: [string, string, string, string][] = [
  [SANS, 'montserrat-latin-500-normal.woff2', '500', 'normal'],
  [SANS, 'montserrat-latin-600-normal.woff2', '600', 'normal'],
  [SANS, 'montserrat-latin-700-normal.woff2', '700', 'normal'],
  [SANS, 'montserrat-latin-800-normal.woff2', '800', 'normal'],
  [SERIFA, 'playfair-display-latin-600-normal.woff2', '600', 'normal'],
  [SERIFA, 'playfair-display-latin-700-normal.woff2', '700', 'normal'],
];
for (const [family, arquivo, weight, style] of fontes) {
  loadFont({family, url: staticFile(`fontes/${arquivo}`), weight, style});
}

export type AnuncioProps = {
  readonly preco: string | null;
  readonly whatsapp: string | null;
  // Preencha somente com pontos confirmados (ex.: "UPA a X minutos").
  readonly pontosProximos: string[];
};

const inicioVoz = JANELAS_DE_VOZ[0][0];
const fimVoz = JANELAS_DE_VOZ[JANELAS_DE_VOZ.length - 1][1];

// Trilha mais presente na abertura e no final; abaixada como cama durante a narração.
const volumeTrilha = (f: number) => {
  const cama = 0.2;
  const cheio = 0.55;
  const nivel = interpolate(
    f,
    [0, inicioVoz - 4, inicioVoz + 4, fimVoz, fimVoz + 12],
    [cheio, cheio, cama, cama, cheio],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const saida = interpolate(f, [DURACAO_TOTAL - 40, DURACAO_TOTAL], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return nivel * saida;
};

const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 8,
        width: `${(frame / (DURACAO_TOTAL - 1)) * 100}%`,
        background: COR.ouro,
      }}
    />
  );
};

const apresentacao = (
  tipo: (typeof CENAS)[number]['transicaoEntrada'],
): TransitionPresentation<Record<string, unknown>> => {
  if (tipo === 'slide-baixo') {
    return slide({direction: 'from-bottom'}) as TransitionPresentation<Record<string, unknown>>;
  }
  if (tipo === 'wipe') {
    return wipe({direction: 'from-left'}) as TransitionPresentation<Record<string, unknown>>;
  }
  return fade() as TransitionPresentation<Record<string, unknown>>;
};

export const Anuncio: React.FC<AnuncioProps> = ({preco, whatsapp, pontosProximos}) => {
  return (
    <AbsoluteFill style={{backgroundColor: COR.carvao}}>
      <TransitionSeries name="Cenas">
        {CENAS.flatMap((cena, i) => {
          const duracao = duracaoCena(cena, i);
          const sequencia = (
            <TransitionSeries.Sequence key={cena.id} name={cena.id} durationInFrames={duracao}>
              {cena.tipo === 'fachada-abertura' ? (
                <CenaAbertura cena={cena} duracao={duracao} />
              ) : cena.tipo === 'localizacao' ? (
                <CenaLocalizacao cena={cena} duracao={duracao} pontosProximos={pontosProximos} />
              ) : cena.tipo === 'fachada-encerramento' ? (
                <CenaEncerramento cena={cena} duracao={duracao} preco={preco} whatsapp={whatsapp} />
              ) : (
                <CenaFoto cena={cena} duracao={duracao} />
              )}
              <Narracao id={cena.id} />
            </TransitionSeries.Sequence>
          );
          if (i === 0) {
            return [sequencia];
          }
          return [
            <TransitionSeries.Transition
              key={`t-${cena.id}`}
              presentation={apresentacao(cena.transicaoEntrada)}
              timing={linearTiming({durationInFrames: TRANSICAO})}
            />,
            sequencia,
          ];
        })}
      </TransitionSeries>
      <BarraProgresso />
      <Audio name="Trilha" src={staticFile('trilha/trilha.wav')} volume={volumeTrilha} />
    </AbsoluteFill>
  );
};
