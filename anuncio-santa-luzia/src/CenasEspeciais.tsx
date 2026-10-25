import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ASSINATURA, Cena} from './cenas';
import {COR, FILTRO_FOTO, Kicker, SANS, SERIFA, Titulo, transformacaoCamera} from './Cena';
import {ENDERECO, Icone, PONTOS} from './localizacao';

// A foto da fachada é horizontal: aparece inteira, sem esticar, sobre um fundo
// desfocado da própria foto, ocupando a largura do quadro vertical.
const FachadaHorizontal: React.FC<{
  readonly cena: Cena;
  readonly duracao: number;
  readonly topo: number;
}> = ({cena, duracao, topo}) => {
  const frame = useCurrentFrame();
  const altura = Math.round((1080 * 902) / 1599);
  return (
    <>
      <Img
        src={staticFile(cena.foto)}
        style={{
          position: 'absolute',
          inset: -80,
          width: 'calc(100% + 160px)',
          height: 'calc(100% + 160px)',
          objectFit: 'cover',
          filter: 'blur(42px) brightness(0.5) saturate(1.1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: topo,
          left: 0,
          width: 1080,
          height: altura,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
        }}
      >
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
      </div>
    </>
  );
};

export const CenaAbertura: React.FC<{readonly cena: Cena; readonly duracao: number}> = ({
  cena,
  duracao,
}) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: COR.carvao, opacity: entrada}}>
      <FachadaHorizontal cena={cena} duracao={duracao} topo={760} />
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 80,
          right: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <Kicker texto={cena.kicker} atraso={1} />
        <Titulo texto={cena.titulo} atraso={cena.tituloEm} tamanho={96} alinhamento="left" />
      </div>
    </AbsoluteFill>
  );
};

const Icones: Record<Icone, React.ReactNode> = {
  pino: (
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  ),
  onibus: (
    <path d="M6 2h12a3 3 0 0 1 3 3v12a2 2 0 0 1-1 1.7V21a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-2H7v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2.3A2 2 0 0 1 3 17V5a3 3 0 0 1 3-3zm-1 4v6h14V6H5zm2 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
  ),
  carrinho: (
    <path d="M2 3h3l2.4 11.2A2 2 0 0 0 9.4 16H18a2 2 0 0 0 1.9-1.4L22 7H6.2L5.6 4.2A1.5 1.5 0 0 0 4.1 3H2zm7.5 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
  ),
  saude: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />,
};

// Bloco de localização: um cartão por vez, cada um entrando junto com a frase da narração.
export const CenaLocalizacao: React.FC<{
  readonly cena: Cena;
  readonly duracao: number;
  readonly inicio: number;
}> = ({cena, duracao, inicio}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: COR.carvao, overflow: 'hidden'}}>
      <Img
        src={staticFile(cena.foto)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: transformacaoCamera(cena.movimento, frame, duracao),
          filter: 'blur(6px) brightness(0.55)',
          scale: '1.04',
        }}
      />
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
        <Titulo texto={cena.titulo} atraso={cena.tituloEm - inicio} tamanho={84} alinhamento="left" />
      </div>
      {PONTOS.map((ponto, i) => {
        const entra = ponto.em - inicio;
        const sai = i === PONTOS.length - 1 ? duracao : PONTOS[i + 1].em - inicio;
        if (frame < entra - 2 || frame > sai + 10) {
          return null;
        }
        const s = spring({frame: frame - entra, fps, config: {damping: 200}});
        const saida = interpolate(frame, [sai - 2, sai + 8], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const extras = [ponto.distancia, ponto.tempo].filter(Boolean).join(' · ');
        return (
          <div
            key={ponto.id}
            style={{
              position: 'absolute',
              left: 80,
              right: 80,
              top: 820,
              opacity: s * saida,
              translate: `0 ${(1 - s) * 50 - (1 - saida) * 30}px`,
              background: 'rgba(18,18,18,0.55)',
              border: `2px solid ${COR.ouroForte}`,
              borderRadius: 32,
              padding: '52px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 22,
              textAlign: 'center',
            }}
          >
            {ponto.foto ? (
              <Img
                src={staticFile(ponto.foto)}
                style={{width: '100%', height: 420, objectFit: 'cover', borderRadius: 20}}
              />
            ) : (
              <svg width="96" height="96" viewBox="0 0 24 24" fill={COR.ouro}>
                {Icones[ponto.icone]}
              </svg>
            )}
            <div
              style={{
                fontFamily: SERIFA,
                fontWeight: 700,
                fontSize: 64,
                lineHeight: 1.1,
                color: '#FFFFFF',
                textWrap: 'balance',
              }}
            >
              {ponto.titulo}
            </div>
            <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 42, color: COR.creme}}>
              {ponto.detalhe}
            </div>
            {extras ? (
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 42, color: COR.ouro}}>
                {extras}
              </div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const CenaEncerramento: React.FC<{
  readonly cena: Cena;
  readonly duracao: number;
  readonly inicio: number;
  readonly contato: string | null;
  readonly preco: string | null;
}> = ({cena, duracao, inicio, contato, preco}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atrasoTitulo = cena.tituloEm - inicio;
  const endereco = spring({frame: frame - atrasoTitulo - 14, fps, config: {damping: 200}});
  const botao = spring({frame: frame - atrasoTitulo - 26, fps, config: {damping: 14}});
  const assinatura = spring({frame: frame - (ASSINATURA.em - inicio), fps, config: {damping: 200}});
  const saida = interpolate(frame, [duracao - 14, duracao], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <AbsoluteFill style={{opacity: saida}}>
        <FachadaHorizontal cena={cena} duracao={duracao} topo={520} />
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
          <Kicker texto={cena.kicker} atraso={2} />
          <Titulo texto={cena.titulo} atraso={atrasoTitulo} tamanho={100} alinhamento="left" />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 1245,
            left: 80,
            right: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 30,
            textAlign: 'center',
          }}
        >
          <div style={{opacity: endereco, translate: `0 ${(1 - endereco) * 20}px`}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 58, color: '#FFFFFF'}}>
              {ENDERECO.rua}
            </div>
            <div
              style={{fontFamily: SANS, fontWeight: 600, fontSize: 42, color: COR.creme, marginTop: 8}}
            >
              {ENDERECO.bairro}
            </div>
          </div>
          <div
            style={{
              scale: String(botao),
              background: `linear-gradient(135deg, ${COR.ouro}, ${COR.ouroForte})`,
              color: COR.carvao,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 46,
              letterSpacing: 3,
              padding: '28px 60px',
              borderRadius: 999,
              boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
            }}
          >
            AGENDE SUA VISITA
          </div>
          {/* Espaço reservado para contato e preço: preencha as props da composição. */}
          <div
            style={{
              minHeight: 64,
              opacity: botao,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 48,
              color: COR.ouro,
            }}
          >
            {contato ? <div>{contato}</div> : null}
            {preco ? <div style={{color: '#FFFFFF'}}>{preco}</div> : null}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 1160,
            left: 80,
            right: 80,
            textAlign: 'center',
            opacity: assinatura,
            fontFamily: SERIFA,
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 46,
            color: COR.creme,
          }}
        >
          {ASSINATURA.texto}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
