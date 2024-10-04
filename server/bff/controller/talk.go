package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"

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

	// get role and situation from query
	role := r.URL.Query().Get("role")
	situation := r.URL.Query().Get("situation")
	locale := r.URL.Query().Get("locale")

	// get messages from form field and parse it to json
	msg := r.FormValue("msg")

	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		fmt.Println(err)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userID := parts[0]

	var sendResBody model.TutorSendResponse
	var pronunciationResBody model.TutorPronunciationResponse
	pronunciationResBody.Data = 0

	// WaitGroup to wait for both service calls
	var wg sync.WaitGroup
	var sendServiceErr, pronunciationServiceErr error

	// Call SendService asynchronously
	wg.Add(1)
	go func() {
		defer wg.Done()
		sendRes, err := service.SendService(msg, userID, role, situation, locale)
		if err != nil || sendRes.StatusCode != http.StatusOK {
			sendServiceErr = fmt.Errorf("Error calling SendService")
			return
		}
		defer sendRes.Body.Close()

		// Decode SendService response
		if err := json.NewDecoder(sendRes.Body).Decode(&sendResBody); err != nil {
			sendServiceErr = fmt.Errorf("Error parsing SendService response")
		}
	}()

	// Call PronunciationService asynchronously if file exists
	voice, _, err := r.FormFile("file")
	if err == nil {
		wg.Add(1)
		go func() {
			defer wg.Done()
			pronunciationRes, err := service.PronunciationService(voice)
			if err != nil || pronunciationRes.StatusCode != http.StatusOK {
				pronunciationServiceErr = fmt.Errorf("Error calling PronunciationService")
				return
			}
			defer pronunciationRes.Body.Close()

			// Decode PronunciationService response
			if err := json.NewDecoder(pronunciationRes.Body).Decode(&pronunciationResBody); err != nil {
				pronunciationServiceErr = fmt.Errorf("Error parsing PronunciationService response")
			}
		}()
	}

	// Wait for both services to finish
	wg.Wait()

	// If any errors occurred, return the appropriate error response
	if sendServiceErr != nil {
		http.Error(w, sendServiceErr.Error(), http.StatusInternalServerError)
		return
	}

	var pronunciationScore float64 = 0
	if pronunciationServiceErr == nil {
		pronunciationScore = pronunciationResBody.Data
	}

	// make response
	response := model.TalkResponseToClient{
		Data: model.TalkResponseToClientData{
			TutorResponse:      sendResBody.Data.TutorResponse,
			TranslatedResponse: sendResBody.Data.TranslatedResponse,
			Hint:               sendResBody.Data.Hint,
			TranslatedHint:     sendResBody.Data.TranslatedHint,
			IsOver:             sendResBody.Data.IsOver,
			Correctness:        sendResBody.Data.Correctness,
			Pronunciation:      pronunciationScore,
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
