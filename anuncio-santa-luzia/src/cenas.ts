// Sequência de edição do anúncio. Cada cena tem uma foto real do imóvel, um título
// de tela e a narração correspondente (public/narracao/<id>.wav).
// `vozFrames` é a duração medida de cada narração a 30 fps (ver producao/gerar-narracao.sh).

export const FPS = 30;
// Duração das transições entre cenas (sobreposição).
export const TRANSICAO = 10;
// A voz começa depois que a transição de entrada termina.
export const ENTRADA_VOZ = TRANSICAO;
// Respiro entre o fim de uma fala e o começo da próxima.
export const RESPIRO = 8;
// Tempo extra no final para ler o CTA de encerramento.
export const SEGURA_FINAL = 60;

export type Movimento = {
  // escala inicial e final (1 = foto preenchendo a tela sem cortes extras)
  readonly zoom: [number, number];
  // deslocamento em % do quadro, inicial e final
  readonly x: [number, number];
  readonly y: [number, number];
};

export type TipoCena = 'foto' | 'fachada-abertura' | 'localizacao' | 'fachada-encerramento';

export type Cena = {
  readonly id: string;
  readonly tipo: TipoCena;
  readonly foto: string;
  readonly ambiente: string;
  readonly titulo: string;
  readonly narracao: string;
  // Em cenas de CTA o título já é a frase falada, então a legenda é omitida.
  readonly legenda: boolean;
  readonly vozFrames: number;
  readonly movimento: Movimento;
  readonly transicaoEntrada: 'fade' | 'slide-baixo' | 'wipe';
};

export const CENAS: Cena[] = [
  {
    id: '01-abertura',
    tipo: 'fachada-abertura',
    foto: 'fotos-tratadas/01-fachada-rua.jpg',
    ambiente: 'Santa Rita · Santa Luzia/MG',
    titulo: 'Conheça esta oportunidade em Santa Luzia!',
    narracao: 'Conheça esta oportunidade em Santa Luzia!',
    legenda: false,
    vozFrames: 89,
    movimento: {zoom: [1.22, 1.0], x: [-4, 0], y: [0, 0]},
    transicaoEntrada: 'fade',
  },
  {
    id: '02-sobrado',
    tipo: 'foto',
    foto: 'fotos-tratadas/02-sobrado.jpg',
    ambiente: 'Fachada',
    titulo: 'Dois pavimentos',
    narracao: 'Uma casa de dois andares, com fachada moderna.',
    legenda: true,
    vozFrames: 77,
    movimento: {zoom: [1.12, 1.02], x: [0, 0], y: [3, 0]},
    transicaoEntrada: 'fade',
  },
  {
    id: '03-area-coberta',
    tipo: 'foto',
    foto: 'fotos-tratadas/03-area-coberta.jpg',
    ambiente: 'Chegada',
    titulo: 'Área coberta',
    narracao: 'Na chegada, uma área coberta e portas de vidro.',
    legenda: true,
    vozFrames: 83,
    movimento: {zoom: [1.02, 1.1], x: [5, -5], y: [0, 0]},
    transicaoEntrada: 'fade',
  },
  {
    id: '04-entrada',
    tipo: 'foto',
    foto: 'fotos-tratadas/04-entrada.jpg',
    ambiente: 'Entrada',
    titulo: 'Acabamento que impressiona',
    narracao: 'Ao entrar, o piso marmorizado valoriza cada ambiente.',
    legenda: true,
    vozFrames: 105,
    movimento: {zoom: [1.02, 1.14], x: [0, 0], y: [0, -2]},
    transicaoEntrada: 'fade',
  },
  {
    id: '05-sala',
    tipo: 'foto',
    foto: 'fotos-tratadas/05-sala.jpg',
    ambiente: 'Sala',
    titulo: 'Sala clara e acolhedora',
    narracao: 'A sala é clara e pronta para receber quem você ama.',
    legenda: true,
    vozFrames: 96,
    movimento: {zoom: [1.04, 1.14], x: [-2, 2], y: [2, 0]},
    transicaoEntrada: 'fade',
  },
  {
    id: '06-escada',
    tipo: 'foto',
    foto: 'fotos-tratadas/06-escada.jpg',
    ambiente: 'Escada',
    titulo: 'Guarda-corpo em vidro',
    narracao: 'A escada, com guarda-corpo de vidro, traz leveza.',
    legenda: true,
    vozFrames: 106,
    movimento: {zoom: [1.12, 1.04], x: [-3, 2], y: [3, -2]},
    transicaoEntrada: 'fade',
  },
  {
    id: '07-cozinha',
    tipo: 'foto',
    foto: 'fotos-tratadas/07-cozinha.jpg',
    ambiente: 'Cozinha',
    titulo: 'Cozinha funcional',
    narracao: 'Na cozinha, bancada em pedra e cuba de inox.',
    legenda: true,
    vozFrames: 132,
    movimento: {zoom: [1.03, 1.13], x: [3, -2], y: [0, 2]},
    transicaoEntrada: 'wipe',
  },
  {
    id: '08-area-servico',
    tipo: 'foto',
    foto: 'fotos-tratadas/08-area-servico.jpg',
    ambiente: 'Área de serviço',
    titulo: 'Área de serviço',
    narracao: 'E uma área de serviço com pia e piso decorado.',
    legenda: true,
    vozFrames: 98,
    movimento: {zoom: [1.1, 1.02], x: [0, 0], y: [-2, 2]},
    transicaoEntrada: 'fade',
  },
  {
    id: '09-hall-superior',
    tipo: 'foto',
    foto: 'fotos-tratadas/09-hall-superior.jpg',
    ambiente: 'Andar superior',
    titulo: 'Andar superior',
    narracao: 'No andar de cima, um hall dá acesso aos quartos.',
    legenda: true,
    vozFrames: 84,
    movimento: {zoom: [1.02, 1.12], x: [0, 1], y: [0, 2]},
    transicaoEntrada: 'slide-baixo',
  },
  {
    id: '10-capitulo',
    tipo: 'foto',
    foto: 'fotos-tratadas/10-corredor-varanda.jpg',
    ambiente: 'Seu novo lar',
    titulo: 'Imagine seu próximo capítulo neste lugar.',
    narracao: 'Imagine seu próximo capítulo neste lugar.',
    legenda: false,
    vozFrames: 116,
    movimento: {zoom: [1.0, 1.24], x: [0, 1], y: [0, 5]},
    transicaoEntrada: 'fade',
  },
  {
    id: '11-quarto-varanda',
    tipo: 'foto',
    foto: 'fotos-tratadas/11-quarto-varanda.jpg',
    ambiente: 'Quarto',
    titulo: 'Quartos com luz natural',
    narracao: 'Quartos claros, com piso amadeirado e saída para a varanda.',
    legenda: true,
    vozFrames: 108,
    movimento: {zoom: [1.04, 1.14], x: [2, -2], y: [0, 1]},
    transicaoEntrada: 'fade',
  },
  {
    id: '12-quarto-banheiro',
    tipo: 'foto',
    foto: 'fotos-tratadas/12-quarto-banheiro.jpg',
    ambiente: 'Quarto',
    titulo: 'Banheiro próprio e varanda',
    narracao: 'Este quarto tem banheiro próprio e acesso à varanda.',
    legenda: true,
    vozFrames: 83,
    movimento: {zoom: [1.12, 1.03], x: [-2, 2], y: [2, 0]},
    transicaoEntrada: 'fade',
  },
  {
    id: '13-quarto-janela',
    tipo: 'foto',
    foto: 'fotos-tratadas/13-quarto-janela.jpg',
    ambiente: 'Quarto',
    titulo: 'Cheio de possibilidades',
    narracao: 'Mais um quarto, iluminado e cheio de possibilidades.',
    legenda: true,
    vozFrames: 100,
    movimento: {zoom: [1.02, 1.12], x: [-2, 2], y: [0, 0]},
    transicaoEntrada: 'fade',
  },
  {
    id: '14-banheiro',
    tipo: 'foto',
    foto: 'fotos-tratadas/14-banheiro.jpg',
    ambiente: 'Banheiro',
    titulo: 'Revestimento decorativo',
    narracao: 'No banheiro, revestimento decorativo.',
    legenda: true,
    vozFrames: 82,
    movimento: {zoom: [1.02, 1.12], x: [0, 0], y: [0, -3]},
    transicaoEntrada: 'wipe',
  },
  {
    id: '15-localizacao',
    tipo: 'localizacao',
    foto: 'fotos-tratadas/02-sobrado.jpg',
    ambiente: 'Localização',
    titulo: 'Mais praticidade para a sua rotina.',
    narracao: 'No bairro Santa Rita. Mais praticidade para a sua rotina.',
    legenda: false,
    vozFrames: 141,
    movimento: {zoom: [1.15, 1.05], x: [0, 0], y: [-3, 0]},
    transicaoEntrada: 'fade',
  },
  {
    id: '16-encerramento',
    tipo: 'fachada-encerramento',
    foto: 'fotos-tratadas/01-fachada-rua.jpg',
    ambiente: 'Agende sua visita',
    titulo: 'Gostou? Entre em contato e agende sua visita!',
    narracao: 'Gostou? Entre em contato e agende sua visita!',
    legenda: false,
    vozFrames: 112,
    movimento: {zoom: [1.0, 1.08], x: [0, 0], y: [0, 0]},
    transicaoEntrada: 'fade',
  },
];

export const duracaoCena = (cena: Cena, indice: number) =>
  ENTRADA_VOZ +
  cena.vozFrames +
  (indice === CENAS.length - 1 ? SEGURA_FINAL : RESPIRO);

export const DURACAO_TOTAL =
  CENAS.reduce((soma, cena, i) => soma + duracaoCena(cena, i), 0) -
  TRANSICAO * (CENAS.length - 1);

// Janelas de fala no tempo global, usadas para abaixar a trilha sob a voz.
export const JANELAS_DE_VOZ: [number, number][] = CENAS.reduce<{
  inicio: number;
  janelas: [number, number][];
}>(
  (acc, cena, i) => {
    const comeco = acc.inicio + ENTRADA_VOZ;
    return {
      inicio: acc.inicio + duracaoCena(cena, i) - TRANSICAO,
      janelas: [...acc.janelas, [comeco, comeco + cena.vozFrames]],
    };
  },
  {inicio: 0, janelas: []},
).janelas;
