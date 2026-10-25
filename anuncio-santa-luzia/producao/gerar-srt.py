"""Gera legendas .srt com os mesmos tempos usados no vídeo (src/cenas.ts)."""
import json
FPS, TRANSICAO, RESPIRO, SEGURA = 30, 10, 8, 60
voz = [89, 77, 83, 105, 96, 106, 132, 98, 84, 116, 108, 83, 100, 82, 141, 112]
roteiro = json.load(open("producao/roteiro.json"))
def tc(f):
    ms = round(f / FPS * 1000)
    return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
inicio, linhas = 0, []
for i, (l, a) in enumerate(zip(roteiro, voz)):
    linhas.append(f"{i+1}\n{tc(inicio+TRANSICAO)} --> {tc(inicio+TRANSICAO+a+4)}\n{l['texto']}\n")
    inicio += TRANSICAO + a + (SEGURA if i == len(voz) - 1 else RESPIRO) - TRANSICAO
open("out/anuncio-santa-luzia.srt", "w").write("\n".join(linhas))
print("total frames", inicio + TRANSICAO)
