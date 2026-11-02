# Momento musicale

Le canzoni in italiano di Roberto Fader: la colonna sonora del romanzo **La città triste**.

> Nella città di Sinea il nuovo presidente vieta i sorrisi. Franco e Chiara decidono di restituire la felicità alla gente.

Il sito è statico e pronto per GitHub Pages: la città è grigia e piove; quando parte una canzone, tornano i colori.

## Tracce

| # | Titolo | Scena nel romanzo | File |
|---|--------|-------------------|------|
| 1 | Tre fermate dopo | La metro di Sinea (cap. 1–2) | `audio/01-tre-fermate-dopo.mp3` |
| 2 | L’amore è sorridere | La riunione segreta (cap. 3–4) | `audio/02-l-amore-e-sorridere.mp3` |
| 3 | Corsa nella notte | Fuga per le strade (cap. 5–6) | `audio/03-corsa-nella-notte.mp3` |
| 4 | Corsa nella notte (II) | Seconda versione | `audio/04-corsa-nella-notte-ii.mp3` |
| 5 | Inno di Sinea | Piazza Grande (cap. 8–9) | `audio/05-inno-di-sinea.mp3` |

## Struttura

```
index.html               la pagina con il lettore
assets/js/canzoni.js     elenco delle canzoni (titolo, scena, capitolo, durata)
assets/js/app.js         lettore audio e testi
assets/css/style.css     stile
audio/                   gli mp3
testi/                   un file .md per ogni testo
```

## Aggiungere una canzone

1. Metti l'mp3 in `audio/` con il nome `NN-titolo.mp3`.
2. Crea `testi/NN-titolo.md` con il testo.
3. Aggiungi una voce in `assets/js/canzoni.js` con lo stesso `id`.

## Formato dei testi

Prima riga `# Titolo`, poi le strofe separate da una riga vuota. Una strofa che inizia con `[Ritornello]` viene mostrata come ritornello. `*corsivo*` e `**grassetto**` funzionano.

## Pubblicazione

Settings → Pages → Deploy from a branch → `main` / root.
