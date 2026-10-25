"""Legendas .srt da narração ElevenLabs (texto revisado; tempos pelas pausas medidas
com silencedetect e pela transcrição whisper.cpp em producao/transcricao-palavras.json).
Tempos no relógio do vídeo: a narração começa em 0,5 s."""
INICIO = 0.5
# (início, fim) em segundos do áudio da narração
FRASES = [
    (0.05, 2.75, "Já imaginou viver em uma casa"),
    (2.75, 5.07, "que une conforto, espaço e praticidade?"),
    (5.74, 8.92, "Esta residência, no bairro Santa Rita, em Santa Luzia,"),
    (9.11, 11.0, "oferece dois pavimentos"),
    (11.0, 14.36, "e ambientes com possibilidades para diferentes momentos da vida."),
    (14.79, 16.81, "A sala valoriza os acabamentos,"),
    (17.08, 21.21, "enquanto a escada com guarda-corpo de vidro traz um toque moderno ao ambiente."),
    (21.67, 25.38, "Na parte superior, os quartos oferecem espaço para a sua família"),
    (25.49, 27.74, "e novas possibilidades para o seu dia a dia."),
    (28.15, 31.12, "A casa também conta com banheiro e acesso à varanda."),
    (31.48, 33.57, "E a localização ajuda na rotina."),
    (33.91, 35.89, "Há pontos de ônibus nas proximidades,"),
    (36.12, 39.27, "supermercados como BH e Mart Minas na cidade,"),
    (39.48, 42.34, "além da UBS Santa Rita, que atende a região."),
    (42.70, 47.32, "Uma oportunidade para quem busca espaço e praticidade em Santa Luzia."),
    (48.10, 50.16, "Gostou? Entre em contato e agende sua visita."),
    (50.44, 52.92, "Seu próximo capítulo pode começar aqui."),
]
def tc(s):
    ms = round((s + INICIO) * 1000)
    return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
blocos = [f"{i+1}\n{tc(a)} --> {tc(b)}\n{t}\n" for i, (a, b, t) in enumerate(FRASES)]
open("out/anuncio-santa-luzia.srt", "w").write("\n".join(blocos))
open("producao/narracao-texto.txt", "w").write(" ".join(t for _, _, t in FRASES) + "\n")
print(len(FRASES), "legendas")
