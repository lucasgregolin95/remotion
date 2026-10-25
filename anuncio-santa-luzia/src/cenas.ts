// Cadastro central do anúncio (v2): cenas, fotos, textos, tempos, transição e áudio.
// Os cortes (`corte`, em frames do vídeo a 30 fps) caem nas pausas da narração
// ElevenLabs e, quando a pausa permite, no tempo da trilha (~110 BPM).
// Ver producao/mapa-de-cortes.md para a correspondência frase → cena.

export const FPS = 30;
// Crossfade único entre todas as cenas (consistência visual).
export const TRANSICAO = 8;
// A narração começa 0,5 s após o início do vídeo.
export const INICIO_NARRACAO = 15;
// Fim da fala no tempo do vídeo (52,92 s de áudio + início).
export const FIM_NARRACAO = 1603;
// Tempo de leitura do encerramento após a última fala.
export const DURACAO_TOTAL = 1703;

export const AUDIO = {
  narracao: 'audio/narracao.m4a',
  trilha: 'audio/trilha-sonora.mp3',
  // volume da trilha antes/depois da fala e como "cama" sob a voz
  trilhaCheia: 0.42,
  trilhaSobVoz: 0.16,
  volumeNarracao: 1,
};

export type Movimento = {
  // escala inicial e final; mantida em até ~1,08 para não ampliar demais fotos de 902 px
  readonly zoom: [number, number];
  // deslocamento em % do quadro (limitado automaticamente à sobra do zoom)
  readonly x: [number, number];
  readonly y: [number, number];
};

export type TipoCena = 'fachada-abertura' | 'foto' | 'cta' | 'localizacao' | 'encerramento';

export type Cena = {
  readonly id: string;
  readonly tipo: TipoCena;
  // frame do vídeo em que a cena assume a tela (meio do crossfade)
  readonly corte: number;
  readonly foto: string;
  readonly kicker: string;
  readonly titulo: string;
  // frame do vídeo em que o título entra (sincronizado com a palavra-chave falada)
  readonly tituloEm: number;
  readonly movimento: Movimento;
};

const F = 'fotos-tratadas/';
const C = 'fotos-corrigidas-tratadas/';

export const CENAS: Cena[] = [
  // A. IMPACTO INICIAL — "Já imaginou viver em uma casa que une conforto,"
  {
    id: 'fachada',
    tipo: 'fachada-abertura',
    corte: 0,
    foto: `${F}01-fachada-rua.jpg`,
    kicker: 'Santa Rita · Santa Luzia/MG',
    titulo: 'Conheça esta oportunidade em Santa Luzia!',
    tituloEm: 3,
    movimento: {zoom: [1.16, 1.0], x: [-3, 0], y: [0, 0]},
  },
  // "espaço e praticidade."
  {
    id: 'area-coberta',
    tipo: 'foto',
    corte: 108,
    foto: `${F}03-area-coberta.jpg`,
    kicker: 'Chegada',
    titulo: 'Conforto, espaço e praticidade',
    tituloEm: 112,
    movimento: {zoom: [1.0, 1.06], x: [0, 0], y: [0, 0]},
  },
  // B. APRESENTAÇÃO — "Esta residência, no bairro Santa Rita, em Santa Luzia, oferece dois pavimentos"
  {
    id: 'sobrado',
    tipo: 'foto',
    corte: 179,
    foto: `${F}02-sobrado.jpg`,
    kicker: 'Bairro Santa Rita',
    titulo: 'Dois pavimentos',
    tituloEm: 300,
    movimento: {zoom: [1.08, 1.02], x: [0, 0], y: [-3.5, 1]},
  },
  // "e ambientes com possibilidades"
  {
    id: 'entrada',
    tipo: 'foto',
    corte: 343,
    foto: `${F}04-entrada.jpg`,
    kicker: 'Entrada',
    titulo: 'Ambientes bem iluminados',
    tituloEm: 347,
    movimento: {zoom: [1.0, 1.06], x: [0, 0], y: [0, 0]},
  },
  // "para diferentes momentos da vida."
  {
    id: 'cozinha',
    tipo: 'foto',
    corte: 398,
    foto: `${F}07-cozinha.jpg`,
    kicker: 'Cozinha',
    titulo: 'Bancada em pedra',
    tituloEm: 402,
    movimento: {zoom: [1.06, 1.0], x: [1, -1], y: [0, 0]},
  },
  // "A sala valoriza os acabamentos,"
  {
    id: 'sala',
    tipo: 'foto',
    corte: 457,
    foto: `${F}05-sala.jpg`,
    kicker: 'Sala',
    titulo: 'Acabamentos valorizados',
    tituloEm: 461,
    movimento: {zoom: [1.0, 1.07], x: [0, 0], y: [1, 0]},
  },
  // C. CONFORTO — "enquanto a escada com guarda-corpo de vidro"
  {
    id: 'escada',
    tipo: 'foto',
    corte: 523,
    foto: `${F}06-escada.jpg`,
    kicker: 'Escada',
    titulo: 'Guarda-corpo em vidro',
    tituloEm: 540,
    movimento: {zoom: [1.07, 1.01], x: [-1, 1], y: [1, -1]},
  },
  // "traz um toque moderno ao ambiente."
  {
    id: 'escada-subida',
    tipo: 'foto',
    corte: 593,
    foto: `${F}extra-escada-subida.jpg`,
    kicker: 'Escada',
    titulo: 'Toque moderno',
    tituloEm: 597,
    movimento: {zoom: [1.0, 1.07], x: [0, 0], y: [2, -2]},
  },
  // "Na parte superior,"
  {
    id: 'hall-superior',
    tipo: 'foto',
    corte: 654,
    foto: `${C}09-hall-superior.jpg`,
    kicker: 'Andar superior',
    titulo: 'Hall de circulação',
    tituloEm: 658,
    movimento: {zoom: [1.0, 1.05], x: [0, 0], y: [0, 1]},
  },
  // "os quartos oferecem espaço para a sua família"
  {
    id: 'quarto-varanda',
    tipo: 'foto',
    corte: 698,
    foto: `${F}11-quarto-varanda.jpg`,
    kicker: 'Quartos',
    titulo: 'Espaço para sua família',
    tituloEm: 718,
    movimento: {zoom: [1.0, 1.07], x: [1, -1], y: [0, 0]},
  },
  // "e novas possibilidades para o seu dia a dia."
  {
    id: 'quarto-janela',
    tipo: 'foto',
    corte: 778,
    foto: `${F}13-quarto-janela.jpg`,
    kicker: 'Quartos',
    titulo: 'Novas possibilidades',
    tituloEm: 782,
    movimento: {zoom: [1.07, 1.0], x: [-1, 1], y: [0, 0]},
  },
  // "A casa também conta com banheiro"
  {
    id: 'banheiro',
    tipo: 'foto',
    corte: 850,
    foto: `${C}14-banheiro.jpg`,
    kicker: 'Banheiro',
    titulo: 'Revestimento decorativo',
    tituloEm: 854,
    movimento: {zoom: [1.0, 1.06], x: [0, 0], y: [0, -1]},
  },
  // "e acesso à varanda."
  {
    id: 'quarto-banheiro-varanda',
    tipo: 'foto',
    corte: 910,
    foto: `${C}12-quarto-banheiro.jpg`,
    kicker: 'Varanda',
    titulo: 'Acesso à varanda',
    tituloEm: 912,
    movimento: {zoom: [1.0, 1.05], x: [0, 1], y: [0, 1]},
  },
  // D. LOCALIZAÇÃO — "E a localização ajuda na rotina. ..." (cartões em src/localizacao.ts)
  {
    id: 'localizacao',
    tipo: 'localizacao',
    corte: 954,
    foto: `${F}02-sobrado.jpg`,
    kicker: 'Localização',
    titulo: 'A localização ajuda na rotina',
    tituloEm: 960,
    movimento: {zoom: [1.08, 1.0], x: [0, 0], y: [-2, 0]},
  },
  // "Uma oportunidade para quem busca espaço e praticidade em Santa Luzia."
  {
    id: 'oportunidade',
    tipo: 'cta',
    corte: 1292,
    foto: `${F}10-corredor-varanda.jpg`,
    kicker: 'Seu novo lar',
    titulo: 'Espaço e praticidade em Santa Luzia',
    tituloEm: 1300,
    movimento: {zoom: [1.0, 1.08], x: [0, 0], y: [0, 3]},
  },
  // E. CHAMADA PARA AÇÃO — "Gostou? Entre em contato e agende sua visita. Seu próximo capítulo pode começar aqui."
  {
    id: 'encerramento',
    tipo: 'encerramento',
    corte: 1456,
    foto: `${F}01-fachada-rua.jpg`,
    kicker: 'Gostou?',
    titulo: 'Agende sua visita',
    tituloEm: 1462,
    movimento: {zoom: [1.0, 1.06], x: [0, 0], y: [0, 0]},
  },
];

// Frase de assinatura no encerramento, junto com "Seu próximo capítulo pode começar aqui."
export const ASSINATURA = {texto: 'Seu próximo capítulo pode começar aqui.', em: 1528};

// Duração de cada TransitionSeries.Sequence de modo que o meio do crossfade fique no corte.
export const duracaoCena = (i: number) => {
  const inicio = i === 0 ? 0 : CENAS[i].corte - TRANSICAO / 2;
  const fim = i === CENAS.length - 1 ? DURACAO_TOTAL : CENAS[i + 1].corte + TRANSICAO / 2;
  return fim - inicio;
};

// Frame do vídeo em que a sequência da cena começa (para converter tempos absolutos).
export const inicioCena = (i: number) => (i === 0 ? 0 : CENAS[i].corte - TRANSICAO / 2);
