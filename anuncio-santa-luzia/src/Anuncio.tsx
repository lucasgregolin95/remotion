import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {loadFont} from '@remotion/fonts';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {
  AUDIO,
  CENAS,
  DURACAO_TOTAL,
  duracaoCena,
  FIM_NARRACAO,
  INICIO_NARRACAO,
  inicioCena,
  TRANSICAO,
} from './cenas';
import {CenaFoto, COR, SANS, SERIFA} from './Cena';
import {CenaAbertura, CenaEncerramento, CenaLocalizacao} from './CenasEspeciais';

const fontes: [string, string, string, string][] = [
  [SANS, 'montserrat-latin-500-normal.woff2', '500', 'normal'],
  [SANS, 'montserrat-latin-600-normal.woff2', '600', 'normal'],
  [SANS, 'montserrat-latin-700-normal.woff2', '700', 'normal'],
  [SANS, 'montserrat-latin-800-normal.woff2', '800', 'normal'],
  [SERIFA, 'playfair-display-latin-600-normal.woff2', '600', 'normal'],
  [SERIFA, 'playfair-display-latin-700-normal.woff2', '700', 'normal'],
  [SERIFA, 'playfair-display-latin-700-italic.woff2', '700', 'italic'],
];
for (const [family, arquivo, weight, style] of fontes) {
  loadFont({family, url: staticFile(`fontes/${arquivo}`), weight, style});
}

export type AnuncioProps = {
  // Telefone/WhatsApp do anunciante, ex.: "WhatsApp (31) 9 0000-0000". null = espaço vazio.
  readonly contato: string | null;
  readonly preco: string | null;
};

// Trilha mais presente antes e depois da fala; "cama" baixa durante a narração.
const volumeTrilha = (f: number) => {
  const nivel = interpolate(
    f,
    [0, INICIO_NARRACAO - 6, INICIO_NARRACAO + 6, FIM_NARRACAO, FIM_NARRACAO + 15],
    [AUDIO.trilhaCheia, AUDIO.trilhaCheia, AUDIO.trilhaSobVoz, AUDIO.trilhaSobVoz, AUDIO.trilhaCheia],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const saida = interpolate(f, [DURACAO_TOTAL - 50, DURACAO_TOTAL], [1, 0], {
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

export const Anuncio: React.FC<AnuncioProps> = ({contato, preco}) => {
  return (
    <AbsoluteFill style={{backgroundColor: COR.carvao}}>
      <TransitionSeries name="Cenas">
        {CENAS.flatMap((cena, i) => {
          const duracao = duracaoCena(i);
          const inicio = inicioCena(i);
          const sequencia = (
            <TransitionSeries.Sequence key={cena.id} name={cena.id} durationInFrames={duracao}>
              {cena.tipo === 'fachada-abertura' ? (
                <CenaAbertura cena={cena} duracao={duracao} />
              ) : cena.tipo === 'localizacao' ? (
                <CenaLocalizacao cena={cena} duracao={duracao} inicio={inicio} />
              ) : cena.tipo === 'encerramento' ? (
                <CenaEncerramento
                  cena={cena}
                  duracao={duracao}
                  inicio={inicio}
                  contato={contato}
                  preco={preco}
                />
              ) : (
                <CenaFoto cena={cena} duracao={duracao} inicio={inicio} />
              )}
            </TransitionSeries.Sequence>
          );
          if (i === 0) {
            return [sequencia];
          }
          return [
            <TransitionSeries.Transition
              key={`t-${cena.id}`}
              presentation={fade()}
              timing={linearTiming({durationInFrames: TRANSICAO})}
            />,
            sequencia,
          ];
        })}
      </TransitionSeries>
      <BarraProgresso />
      <Sequence name="Narração (ElevenLabs)" from={INICIO_NARRACAO} layout="none">
        <Audio src={staticFile(AUDIO.narracao)} volume={AUDIO.volumeNarracao} />
      </Sequence>
      <Audio name="Trilha sonora" src={staticFile(AUDIO.trilha)} volume={volumeTrilha} />
    </AbsoluteFill>
  );
};
