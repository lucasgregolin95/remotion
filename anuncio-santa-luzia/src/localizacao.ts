// Informações de localização — somente o que foi verificado (pesquisa em 25/10/2026).
// `distancia` e `tempo` ficam null até serem medidos no trajeto real (ex.: Google Maps
// a partir de Rua Laureano Rocha, 173). Quando preenchidos, aparecem no cartão.
// `foto`: caminho em public/ de uma foto própria do local (null = cartão sem foto).

export const ENDERECO = {
  rua: 'Rua Laureano Rocha, 173',
  bairro: 'Bairro Santa Rita — Santa Luzia/MG',
  // CEP indicado por guia de CEPs de terceiros; confirmar nos Correios antes de exibir.
  cep: null as string | null,
};

export type Icone = 'pino' | 'onibus' | 'carrinho' | 'saude';

export type PontoLocal = {
  readonly id: string;
  readonly icone: Icone;
  readonly titulo: string;
  readonly detalhe: string;
  readonly distancia: string | null;
  readonly tempo: string | null;
  readonly foto: string | null;
  // frame do vídeo em que o cartão entra (sincronizado com a narração)
  readonly em: number;
  readonly status: 'verificado' | 'parcial' | 'a confirmar';
  readonly fontes: string[];
};

export const PONTOS: PontoLocal[] = [
  {
    id: 'endereco',
    icone: 'pino',
    titulo: ENDERECO.rua,
    detalhe: ENDERECO.bairro,
    distancia: null,
    tempo: null,
    foto: null,
    em: 958,
    status: 'verificado',
    fontes: ['Endereço informado pelo anunciante'],
  },
  {
    // Narração: "Há pontos de ônibus nas proximidades". Linhas e pontos não foram
    // confirmados; por isso o texto na tela é neutro.
    id: 'transporte',
    icone: 'onibus',
    titulo: 'Transporte coletivo',
    detalhe: 'Acesso ao transporte coletivo da região',
    distancia: null,
    tempo: null,
    foto: null,
    em: 1030,
    status: 'a confirmar',
    fontes: [],
  },
  {
    // Narração: "supermercados como BH e Mart Minas na cidade".
    id: 'supermercados',
    icone: 'carrinho',
    titulo: 'Supermercados BH e Mart Minas',
    detalhe: 'Lojas das duas redes em Santa Luzia',
    distancia: null,
    tempo: null,
    foto: null,
    em: 1096,
    status: 'parcial',
    fontes: [
      'https://www.tiendeo.com.br/Lojas/santa-luzia/avenida-bras%C3%ADlia/157898',
      'https://gironews.com/atacado-cash-carry/mart-minas-inaugura-mais-uma-loja-em-santa-luzia-mg/',
      'https://www.tiendeo.com.br/Lojas/santa-luzia/av-das-industrias-n-distrito-industrial-desembargador-mello-junior/892285',
    ],
  },
  {
    // Narração: "UBS Santa Rita que atende a região". No CNES da Prefeitura consta a
    // "Unidade de Saúde Santa Rita Sebastião Vaz" (CNES 2164108), no bairro Santa Rita.
    // É unidade básica (UBS), não UPA.
    id: 'saude',
    icone: 'saude',
    titulo: 'UBS Santa Rita',
    detalhe: 'Unidade básica de saúde do bairro',
    distancia: null,
    tempo: null,
    foto: null,
    em: 1194,
    status: 'parcial',
    fontes: [
      'https://cnes2.datasus.gov.br/Listar_Mantidas.asp?VCnpj=18715409000150&VEstado=31&VNome=PREFEITURA+MUNICIPAL+DE+SANTA+LUZIA',
      'https://www.santaluzia.mg.gov.br/noticiasv3/unidade-de-saude-do-bairro-santa-rita-completa-1-ano-em-novo-predio/',
    ],
  },
];
