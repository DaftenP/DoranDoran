package controller

import (
	"encoding/json"
	"fmt"
	"net/http"

	"com.doran.bff/model"
	"com.doran.bff/service"
)

// Post /api/v1/bff/talk/response
func SendController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fmt.Println("Current Method : " + r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get role aand situation from query
	role := r.URL.Query().Get("role")
	situation := r.URL.Query().Get("situation")
	locale := r.URL.Query().Get("locale")

	// get messages from form field and parse it to json
	messages := r.FormValue("messages")
	var messagesJson json.RawMessage
	if err := json.Unmarshal([]byte(messages), &messagesJson); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// get userMessage from form field and parse it to json
	userMessage := r.FormValue("userMessage")
	var userMessageJson json.RawMessage
	if err := json.Unmarshal([]byte(userMessage), &userMessageJson); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	sendRes, err := service.SendService(messagesJson, userMessageJson, role, situation, locale)
	if err != nil || sendRes.StatusCode != http.StatusOK {
		http.Error(w, "Error calling SendService", http.StatusInternalServerError)
		return
	}
	defer sendRes.Body.Close()

	// get voice. content-type: audio/wav, key: voice, value: audio file
	voice, _, err := r.FormFile("voice")

	var pronunciationResBody model.TutorPronunciationResponse
	if err == nil {
		pronunciationRes, err := service.PronunciationService(voice)
		if err != nil || pronunciationRes.StatusCode != http.StatusOK {
			http.Error(w, "Error calling PronunciationService", http.StatusInternalServerError)
			return
		}
		defer pronunciationRes.Body.Close()

		// get pronunciation from pronunciationRes's body
		if err := json.NewDecoder(pronunciationRes.Body).Decode(&pronunciationResBody); err != nil {
			http.Error(w, "Error parsing PronunciationService response", http.StatusInternalServerError)
			return
		}

		fmt.Println(pronunciationResBody)
	} else {
		pronunciationResBody.Data = 0
	}

	var sendResBody model.TutorSendResponse
	if err := json.NewDecoder(sendRes.Body).Decode(&sendResBody); err != nil {
		http.Error(w, "Error parsing SendService response", http.StatusInternalServerError)
		return
	}

	fmt.Println(sendResBody)

	// make response
	response := model.TutorCombinedResponse{
		Data: model.TutorCombinedResponseData{
			TutorResponse:      sendResBody.Data.TutorResponse,
			TranslatedResponse: sendResBody.Data.TranslatedResponse,
			Hint:               sendResBody.Data.Hint,
			TranslatedHint:     sendResBody.Data.TranslatedHint,
			IsOver:             sendResBody.Data.IsOver,
			Correctness:        sendResBody.Data.Correctness,
			Pronunciation:      pronunciationResBody.Data,
		},
		Message:   sendResBody.Message,
		Timestamp: sendResBody.Timestamp,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
