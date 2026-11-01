# Zoom out – pátio logístico

Recriação em alta qualidade da cena de zoom out: começa no pátio, no nível do
chão (fila de caminhões, prédio cinza, árvores), sobe e inclina sobre o asfalto
sombreado e abre até a vista aérea de todo o complexo.

- Composição: `ZoomOutPatio` – 3840×2160 (4K), 60 fps, 11 s
- Imagens originais: `source/inicial.webp` e `source/final.webp`
- Imagens tratadas: `public/inicial-8k.jpg` e `public/final-5k.jpg`
  (ampliadas 4× com Real-ESRGAN, misturadas 20% com Lanczos e com grão leve)

Props editáveis no Studio:

- `focoX` / `focoY`: ponto da vista aérea onde a câmera "pousa" (0–1)
- `zoomInicial`: quanto a vista aérea começa ampliada

## Comandos

```bash
npm i
npm run dev
npx remotion render ZoomOutPatio out/zoom-out-patio-4k.mp4 --codec=h264 --crf=14
```
