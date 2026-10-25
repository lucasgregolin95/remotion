# Anúncio: Rua Laureano Rocha, 173, Santa Rita, Santa Luzia/MG

Vídeo publicitário vertical (1080 × 1920, 30 fps, 60 s) montado em Remotion a partir das fotos reais do imóvel.

## Conceito

**"Seu próximo capítulo começa na porta de casa."** A peça conduz o espectador como numa visita guiada: rua, chegada, entrada, sala, cozinha, subida pela escada, quartos e banheiro. A visita termina na fachada iluminada com o convite para agendar.
Paleta neutra com dourado (tirado da iluminação quente da fachada e do piso amadeirado), títulos em serifa elegante (Playfair Display) e textos de apoio em Montserrat.

## Sequência de edição

| # | Tempo | Foto | Título na tela | Locução / legenda | Câmera · transição de entrada |
|---|---|---|---|---|---|
| 1 | 0:00 | 01-fachada-rua | Conheça esta oportunidade em Santa Luzia! | Conheça esta oportunidade em Santa Luzia! | zoom-out revelando a fachada · abre do preto |
| 2 | 0:03 | 02-sobrado | Dois pavimentos | Uma casa de dois andares, com fachada moderna. | descida suave · fade |
| 3 | 0:06 | 03-area-coberta | Área coberta | Na chegada, uma área coberta e portas de vidro. | aproximação · fade |
| 4 | 0:09 | 04-entrada | Acabamento que impressiona | Ao entrar, o piso marmorizado valoriza cada ambiente. | aproximação · fade |
| 5 | 0:13 | 05-sala | Sala clara e acolhedora | A sala é clara e pronta para receber quem você ama. | aproximação com panorâmica · fade |
| 6 | 0:16 | 06-escada | Guarda-corpo em vidro | A escada, com guarda-corpo de vidro, traz leveza. | afastamento diagonal · fade |
| 7 | 0:20 | 07-cozinha | Cozinha funcional | Na cozinha, bancada em pedra e cuba de inox. | aproximação · wipe |
| 8 | 0:25 | 08-area-servico | Área de serviço | E uma área de serviço com pia e piso decorado. | afastamento · fade |
| 9 | 0:28 | 09-hall-superior | Andar superior | No andar de cima, um hall dá acesso aos quartos. | aproximação · slide de baixo ("subindo") |
| 10 | 0:31 | 10-corredor-varanda | **CTA:** Imagine seu próximo capítulo neste lugar. | (mesma frase) | push-in pela porta até a varanda · fade |
| 11 | 0:35 | 11-quarto-varanda | Quartos com luz natural | Quartos claros, com piso amadeirado e saída para a varanda. | aproximação · fade |
| 12 | 0:39 | 12-quarto-banheiro | Banheiro próprio e varanda | Este quarto tem banheiro próprio e acesso à varanda. | afastamento · fade |
| 13 | 0:42 | 13-quarto-janela | Cheio de possibilidades | Mais um quarto, iluminado e cheio de possibilidades. | panorâmica lateral · fade |
| 14 | 0:46 | 14-banheiro | Revestimento decorativo | No banheiro, revestimento decorativo. | aproximação · wipe |
| 15 | 0:49 | 02-sobrado (escurecida) | **CTA:** Mais praticidade para a sua rotina. | No bairro Santa Rita. Mais praticidade para a sua rotina. | cartão de endereço · fade |
| 16 | 0:54 | 01-fachada-rua | **CTA:** Gostou? Entre em contato e agende sua visita! | (mesma frase) | botão "Agende sua visita" + área de preço/WhatsApp · fade para o preto |

Os tempos exatos estão em `src/cenas.ts` e as legendas em `out/anuncio-santa-luzia.srt`.

### Fotos não usadas (e por quê)

- `nao-usada-quarto-teto.jpg`: o teto aparece com acabamento aberto (fiação/remendo). Mostrar isso não ajuda a vender; essa parte é melhor vista na visita.
- `extra-*`: ângulos repetidos de sala, escada, hall e quarto. Ficam disponíveis para versões curtas (15 s).

## Como reproduzir

```bash
npm i
./producao/tratar-fotos.sh                       # correção de luz/cor/nitidez (ffmpeg)
python3 producao/gerar-trilha.py                 # trilha original sintetizada
PIPER=piper VOZ=pt-br-edresson-low.onnx ./producao/gerar-narracao.sh   # narração (pip install piper-tts)
python3 producao/gerar-srt.py                    # legendas .srt
npx remotion studio                              # pré-visualizar
npx remotion render AnuncioSantaLuzia out/anuncio-santa-luzia-9x16.mp4 --crf=17
```

Para inserir **preço, WhatsApp e pontos próximos confirmados**, passe as props:

```bash
npx remotion render AnuncioSantaLuzia out/final.mp4 \
  --props='{"preco":"R$ ...","whatsapp":"(31) 9....-....","pontosProximos":["UPA ... (confirmado)","Ponto de ônibus ..."]}'
```

Se a duração de alguma narração mudar, atualize `vozFrames` em `src/cenas.ts` (o script de narração imprime as durações; multiplique por 30 e arredonde para cima).

## Origem e licenças dos recursos

- **Fotos:** enviadas pelo anunciante.
- **Narração:** síntese local com Piper, voz pt-BR "edresson" (dataset TTS-Portuguese-Corpus, CC BY 4.0; atribuição: Edresson Casanova). É uma voz de baixa resolução (16 kHz), tratada com EQ e compressão. Para veiculação paga, recomenda-se regravar com locutor profissional usando o mesmo roteiro e os mesmos tempos.
- **Trilha:** composição original gerada por código (`producao/gerar-trilha.py`), sem samples de terceiros, com uso livre.
- **Fontes:** Montserrat e Playfair Display (SIL Open Font License).
