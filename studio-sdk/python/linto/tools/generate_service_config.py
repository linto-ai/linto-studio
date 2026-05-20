from .remove_leading_slash import remove_leading_slash
from .safe_int import safe_int

def generate_service_config(
    service,
    enable_punctuation=False,
    enable_diarization=False,
    number_of_speaker=0,
    language_value=None,
):
    if not service:
        return None

    language_value = language_value or service.get("language", "*")
    is_whisper = service.get("model_type") == "whisper"
    sub_services = service.get("sub_services", {})

    punctuation_list = sub_services.get("punctuation", [])
    punctuation_service = (
        punctuation_list[0]["service_name"]
        if enable_punctuation and not is_whisper and punctuation_list
        else None
    )

    diarization_list = sub_services.get("diarization", [])
    diarization_service = (
        diarization_list[0]["service_name"]
        if enable_diarization and diarization_list
        else None
    )

    # Diarization is only effectively enabled when a worker is actually
    # available for it. When the caller asks for it but the selected ASR
    # service exposes no diarization sub-service, fall back gracefully
    # instead of sending enableDiarization=True with serviceName=null
    # (which would silently hang the transcription on the gateway side).
    diarization_effective = bool(enable_diarization and diarization_service)

    # Meet backend may pass number_of_speaker as a string (e.g. "0" or "3").
    number_of_speaker_int = safe_int(number_of_speaker)

    return {
        "serviceName": service["serviceName"],
        "endpoint": remove_leading_slash(service["endpoints"][0]["endpoint"]),
        "lang": language_value,
        "config": {
            "language": language_value,
            "punctuationConfig": {
                "enablePunctuation": enable_punctuation and not is_whisper,
                "serviceName": punctuation_service,
            },
            "diarizationConfig": {
                "enableDiarization": diarization_effective,
                "numberOfSpeaker": (
                    number_of_speaker_int
                    if diarization_effective and number_of_speaker_int > 0
                    else None
                ),
                "maxNumberOfSpeaker": 100 if diarization_effective else None,
                "serviceName": diarization_service,
            },
            "enableNormalization": True,
            "modelType": service.get("model_type"),
            "vadConfig": {
                "enableVAD": True,
                "methodName": "WebRTC",
                "minDuration": 30 if is_whisper else 0,
            },
        },
    }