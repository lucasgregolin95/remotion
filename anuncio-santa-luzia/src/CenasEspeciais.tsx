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
import {Cena, ENTRADA_VOZ} from './cenas';
import {COR, Kicker, SANS, Titulo, transformacaoCamera} from './Cena';

export const ENDERECO = 'Rua Laureano Rocha, 173';
export const BAIRRO = 'Bairro Santa Rita · Santa Luzia/MG';

// A foto da fachada é horizontal: ela aparece inteira, sem esticar, sobre um
// fundo desfocado da própria foto, ocupando a largura do quadro vertical.
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
          }}
        />
      </div>
    </>
  );
};

const LinhaEndereco: React.FC<{readonly atraso: number}> = ({atraso}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - atraso, fps, config: {damping: 200}});
  return (
    <div style={{opacity: s, translate: `0 ${(1 - s) * 20}px`, textAlign: 'center'}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, color: '#FFFFFF'}}>
        {ENDERECO}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 38,
          color: COR.creme,
          opacity: 0.85,
          marginTop: 10,
        }}
      >
        {BAIRRO}
      </div>
    </div>
  );
};

export const CenaAbertura: React.FC<{readonly cena: Cena; readonly duracao: number}> = ({
  cena,
  duracao,
}) => {
  const frame = useCurrentFrame();
  // abertura a partir do preto
  const entrada = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: COR.carvao, opacity: entrada}}>
      <FachadaHorizontal cena={cena} duracao={duracao} topo={720} />
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
        <Kicker texto={cena.ambiente} atraso={2} />
        <Titulo texto={cena.titulo} atraso={ENTRADA_VOZ - 4} tamanho={96} alinhamento="left" />
      </div>
      <div style={{position: 'absolute', top: 1390, left: 80, right: 80}}>
        <LinhaEndereco atraso={ENTRADA_VOZ + 30} />
      </div>
    </AbsoluteFill>
  );
};

const Pino: React.FC = () => (
  <svg width="84" height="84" viewBox="0 0 24 24">
    <path
      d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
      fill={COR.ouro}
    />
  </svg>
);

export const CenaLocalizacao: React.FC<{
  readonly cena: Cena;
  readonly duracao: number;
  readonly pontosProximos: string[];
}> = ({cena, duracao, pontosProximos}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cartao = spring({frame: frame - 6, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{backgroundColor: COR.carvao, overflow: 'hidden'}}>
      <Img
        src={staticFile(cena.foto)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: transformacaoCamera(cena.movimento, frame, duracao),
        }}
      />
      <AbsoluteFill style={{background: 'rgba(10,10,10,0.6)'}} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 80px',
          gap: 56,
        }}
      >
        <Kicker texto={cena.ambiente} atraso={2} />
        <div
          style={{
            opacity: cartao,
            scale: String(0.94 + cartao * 0.06),
            background: 'rgba(247,242,234,0.1)',
            border: `2px solid ${COR.ouroForte}`,
            borderRadius: 32,
            padding: '44px 48px',
            width: 920,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <Pino />
          <LinhaEndereco atraso={10} />
          {pontosProximos.length > 0 ? (
            <div
              style={{
                marginTop: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                alignSelf: 'stretch',
              }}
            >
              {pontosProximos.map((ponto, i) => {
                const s = spring({frame: frame - 30 - i * 6, fps, config: {damping: 200}});
                return (
                  <div
                    key={ponto}
                    style={{
                      opacity: s,
                      fontFamily: SANS,
                      fontWeight: 600,
                      fontSize: 44,
                      color: '#FFFFFF',
                      display: 'flex',
                      gap: 18,
                    }}
                  >
                    <span style={{color: COR.ouro}}>✓</span>
                    {ponto}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <Titulo texto={cena.titulo} atraso={ENTRADA_VOZ + 40} tamanho={92} alinhamento="center" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CenaEncerramento: React.FC<{
  readonly cena: Cena;
  readonly duracao: number;
  readonly preco: string | null;
  readonly whatsapp: string | null;
}> = ({cena, duracao, preco, whatsapp}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const botao = spring({frame: frame - ENTRADA_VOZ - 30, fps, config: {damping: 14}});
  const painel = spring({frame: frame - ENTRADA_VOZ - 44, fps, config: {damping: 200}});
  const saida = interpolate(frame, [duracao - 12, duracao], [1, 0], {
    extrapolateLeft: 'clamp',
  });
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <AbsoluteFill style={{opacity: saida}}>
        <FachadaHorizontal cena={cena} duracao={duracao} topo={640} />
        <div
          style={{
            position: 'absolute',
            top: 200,
            left: 80,
            right: 80,
            display: 'flex',
            flexDirection: 'column',
            gap: 26,
          }}
        >
          <Kicker texto={cena.ambiente} atraso={2} />
          <Titulo texto={cena.titulo} atraso={ENTRADA_VOZ - 4} tamanho={84} alinhamento="left" />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 1300,
            left: 80,
            right: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 34,
          }}
        >
          <div
            style={{
              scale: String(botao),
              background: `linear-gradient(135deg, ${COR.ouro}, ${COR.ouroForte})`,
              color: COR.carvao,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 48,
              letterSpacing: 3,
              padding: '30px 64px',
              borderRadius: 999,
              boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
            }}
          >
            AGENDE SUA VISITA
          </div>
          {/* Área reservada para preço e WhatsApp: preencha as props da composição. */}
          <div
            style={{
              opacity: painel,
              minHeight: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              textAlign: 'center',
            }}
          >
            {preco ? (
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, color: '#FFFFFF'}}>
                {preco}
              </div>
            ) : null}
            {whatsapp ? (
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 48, color: COR.ouro}}>
                WhatsApp {whatsapp}
              </div>
            ) : null}
            {!preco && !whatsapp ? (
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 40, color: COR.creme}}>
                {ENDERECO} · Santa Rita
              </div>
            ) : null}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
