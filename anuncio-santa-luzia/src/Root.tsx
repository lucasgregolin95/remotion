import {Composition} from 'remotion';
import {Anuncio} from './Anuncio';
import {DURACAO_TOTAL, FPS} from './cenas';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AnuncioSantaLuzia"
      component={Anuncio}
      durationInFrames={DURACAO_TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{
        preco: null,
        whatsapp: null,
        pontosProximos: [],
      }}
    />
  );
};
