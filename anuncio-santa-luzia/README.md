# Anúncio: Rua Laureano Rocha, 173, Santa Rita, Santa Luzia/MG (v2)

Vídeo publicitário vertical em Remotion: 1080 × 1920, 30 fps, 56,8 s (1703 frames), H.264/AAC.
Composição: `AnuncioSantaLuzia`.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `src/cenas.ts` | cadastro central: cenas, fotos, textos, frames de corte, transição, áudio e volumes |
| `src/localizacao.ts` | endereço e pontos de referência, com status de verificação e fontes |
| `src/Cena.tsx` | câmera virtual, tipografia e cena de foto |
| `src/CenasEspeciais.tsx` | abertura, bloco de localização e encerramento |
| `src/Anuncio.tsx` | montagem (TransitionSeries com crossfade único), narração e trilha com volumes independentes |
| `public/fotos/` | fotos originais recebidas na v1 |
| `public/fotos-corrigidas/` | fotos corrigidas recebidas na v2 (originais) |
| `public/fotos-tratadas/`, `public/fotos-corrigidas-tratadas/` | versões ampliadas e tratadas usadas no vídeo |
| `public/audio/` | narração ElevenLabs (só normalizada, sem alteração de velocidade) e trilha |
| `producao/audio-original/` | arquivos de áudio exatamente como recebidos |
| `producao/v1/` | narração e trilha sintéticas da v1 (arquivadas, não usadas) |

## Mapa de cortes (narração → cena)

Cada corte cai numa pausa da fala. Quando a pausa permite, ele também cai no tempo da trilha (~110 BPM).

| Bloco | Tempo | Frase da narração | Foto | Texto na tela |
|---|---|---|---|---|
| A | 0:00 | Já imaginou viver em uma casa que une conforto, | fachada da rua | Conheça esta oportunidade em Santa Luzia! |
| A | 0:03.6 | espaço e praticidade? | área coberta | Conforto, espaço e praticidade |
| B | 0:06.0 | Esta residência, no bairro Santa Rita… oferece dois pavimentos | sobrado | Dois pavimentos |
| B | 0:11.4 | e ambientes com possibilidades | entrada | Ambientes bem iluminados |
| B | 0:13.3 | para diferentes momentos da vida. | cozinha | Bancada em pedra |
| B | 0:15.2 | A sala valoriza os acabamentos, | sala | Acabamentos valorizados |
| C | 0:17.4 | enquanto a escada com guarda-corpo de vidro | escada | Guarda-corpo em vidro |
| C | 0:19.8 | traz um toque moderno ao ambiente. | escada (subida) | Toque moderno |
| C | 0:21.8 | Na parte superior, | hall superior **(corrigida)** | Hall de circulação |
| C | 0:23.3 | os quartos oferecem espaço para a sua família | quarto com varanda | Espaço para sua família |
| C | 0:25.9 | e novas possibilidades para o seu dia a dia. | quarto com janela | Novas possibilidades |
| C | 0:28.3 | A casa também conta com banheiro | banheiro **(corrigida)** | Revestimento decorativo |
| C | 0:30.3 | e acesso à varanda. | quarto com banheiro e varanda **(corrigida)** | Acesso à varanda |
| D | 0:31.8 | E a localização ajuda na rotina. | cartão de endereço | Rua Laureano Rocha, 173 |
| D | 0:34.3 | Há pontos de ônibus nas proximidades, | cartão | Transporte coletivo |
| D | 0:36.5 | supermercados como BH e Mart Minas na cidade, | cartão | Supermercados BH e Mart Minas |
| D | 0:39.8 | além da UBS Santa Rita, que atende a região. | cartão | UBS Santa Rita |
| E | 0:43.1 | Uma oportunidade para quem busca espaço e praticidade… | corredor até a varanda | Espaço e praticidade em Santa Luzia |
| E | 0:48.5 | Gostou? Entre em contato e agende sua visita. Seu próximo capítulo pode começar aqui. | fachada | Agende sua visita + endereço + contato |

## Como usar

```bash
npm i
npx remotion studio                       # pré-visualizar
npx remotion render AnuncioSantaLuzia out/final.mp4 --crf=17 \
  --props='{"contato":"WhatsApp (31) 9 0000-0000","preco":null}'
python3 producao/gerar-srt.py             # legendas .srt (out/anuncio-santa-luzia.srt)
```

- **Contato e preço:** use as props `contato` e `preco`. Com `null`, o espaço fica vazio.
- **Distâncias e tempos de deslocamento:** preencha `distancia` e `tempo` em `src/localizacao.ts` depois de medir o trajeto real. Eles aparecem no cartão automaticamente.
- **Fotos próprias dos locais:** coloque em `public/` e informe o caminho no campo `foto` de cada ponto.
- **Nova narração:** substitua `public/audio/narracao.m4a`. Se as frases mudarem de tempo, ajuste os `corte`/`tituloEm` em `src/cenas.ts` e as frases em `producao/gerar-srt.py`.

## Recursos

- Fotos: do anunciante.
- Narração: ElevenLabs, fornecida pelo anunciante.
- Trilha: fornecida pelo anunciante. O anunciante confirma a licença de uso.
- Fontes: Montserrat e Playfair Display (SIL Open Font License).
