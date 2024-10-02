package controller

import (
	"net/http"

	"com.doran.bff/service"
)

func GenerateTTSController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	text := r.FormValue("text")
	voice := r.FormValue("voice")
	if text == "" || voice == "" {
		http.Error(w, "Missing text or voice", http.StatusBadRequest)
		return
	}

	ttsRes, err := service.TTSService(text, voice)
	if err != nil {
		http.Error(w, "Error calling TTSService", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "audio/mpeg")

	w.WriteHeader(http.StatusOK)
	_, err = w.Write(ttsRes)
	if err != nil {
		http.Error(w, "Error writing audio data", http.StatusInternalServerError)
		return
	}
}
