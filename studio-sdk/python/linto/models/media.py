from typing import Any, Dict, List, Optional
import logging


def time_to_hms(seconds: Optional[float]) -> str:
    """Convertit un temps en secondes en format HH:MM:SS."""
    if seconds is None:
        return "00:00:00"
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f"{h:02}:{m:02}:{s:02}"


class Media:
    """Classe représentant un média, avec propriétés calculées dynamiquement."""

    def __init__(self, media: Dict[str, Any]):
        self._media = media

    def __getattr__(self, name: str) -> Any:
        return media.get(name)
    
    def __str__(self):
        return self.raw_text

    @property
    def raw_text(self) -> str:
        """Concatène tous les segments texte."""
        return "".join(turn.get("segment", "") + "\n" for turn in self._media.get("text", []))

    @property
    def turns(self) -> List[Dict[str, Any]]:
        """Retourne la liste des tours de parole enrichis."""
        return compute_turns(self._media)

    def to_format(
        self,
        *,
        sep: str = " - ",
        meta_text_sep: str = " : ",
        eol: str = "CRLF",
        ensure_final_eol: bool = False,
        include: Dict[str, bool] = None,
        order: List[str] = None,
    ) -> str:
        """Formate le média sous forme textuelle, avec options configurables."""
        return format_media(
            self._media,
            sep=sep,
            meta_text_sep=meta_text_sep,
            eol=eol,
            ensure_final_eol=ensure_final_eol,
            include=include or {"speaker": True, "lang": True, "timestamp": True},
            order=order or ["speaker", "lang", "timestamp"],
        )


def compute_turns(media: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Construit les tours de parole avec métadonnées."""
    indexed_speakers = {
        spk["speaker_id"]: spk for spk in media.get("speakers", [])
    }

    default_lang = (media.get("locale", ["xx-xx"]) or ["xx-xx"])[0]

    turns = []
    for turn in media.get("text", []):
        words = turn.get("words", [])
        first_word = words[0] if words else {}
        last_word = words[-1] if words else {}

        speaker_info = indexed_speakers.get(turn.get("speaker_id"), {})
        turns.append({
            "speaker": speaker_info.get("speaker_name"),
            "lang": turn.get("lang") or turn.get("language") or default_lang,
            "text": turn.get("segment", ""),
            "stime": (turn.get("word", {}) or {}).get("stime", first_word.get("stime")),
            "etime": (turn.get("word", {}) or {}).get("etime", last_word.get("etime")),
        })

    return turns


def format_media(
    media: Dict[str, Any],
    *,
    sep: str = " - ",
    meta_text_sep: str = " : ",
    eol: str = "CRLF",
    ensure_final_eol: bool = False,
    include: Optional[Dict[str, bool]] = None,
    order: Optional[List[str]] = None,
) -> str:
    include = include or {"speaker": True, "lang": True, "timestamp": True}
    order = order or ["speaker", "lang", "timestamp"]

    eol_str = "\r\n" if eol == "CRLF" else "\n"

    lines = []
    for turn in compute_turns(media):
        parts = []
        for item in order:
            if item == "speaker" and include.get("speaker") and turn.get("speaker"):
                parts.append(turn["speaker"])
            elif item == "lang" and include.get("lang") and turn.get("lang"):
                parts.append(turn["lang"])
            elif item == "timestamp" and include.get("timestamp") and turn.get("stime") is not None:
                parts.append(time_to_hms(turn["stime"]))

        line = sep.join(parts) + meta_text_sep + turn.get("text", "")
        lines.append(line)

    result = eol_str.join(lines)  # EOL entre les lignes seulement

    if ensure_final_eol:
        result += eol_str

    return result


if __name__ == "__main__":
    media_example = {
        "locale": ["fr-FR"],
        "speakers": [{"speaker_id": 1, "speaker_name": "Alice"}],
        "text": [
            {
                "speaker_id": 1,
                "segment": "Bonjour à tous",
                "lang": "fr",
                "words": [{"stime": 0.0}, {"etime": 2.5}],
            }
        ],
    }

    media = Media(media_example)
    assert media.raw_text == "Bonjour à tous\n"
    assert media.turns == [{'speaker': 'Alice', 'lang': 'fr', 'text': 'Bonjour à tous', 'stime': 0.0, 'etime': 2.5}]
    assert media.to_format(sep=" | ", eol="LF", ensure_final_eol=False) == "Alice | fr | 00:00:00 : Bonjour à tous"