# Bug : duplication de mot avec surlignage `word--active`

## Symptôme

Dans la transcription, un mot apparaît dupliqué à un endroit où il ne devrait pas être. Le mot original est à sa place légitime (typiquement en début/milieu du turn). Le doublon apparaît ailleurs (typiquement en fin du turn), généralement collé au texte précédent **sans espace** (ex : `imaginaire.gens,` où "gens," est le doublon).

Le doublon est rendu avec la classe `.word--active` (couleur speaker + underline).

## Conditions d'apparition

- Apparaît **suite à de l'édition** dans le turn (pas immédiat, semble nécessiter une séquence d'édits).
- Pas systématique — "des fois".
- Le mot dupliqué est un vrai mot du turn, pas une chaîne aléatoire.
- Le bug est antérieur au refactor `storeSync.ts` / `useAudioPlayer.ts` de la session du 2026-05-06.
