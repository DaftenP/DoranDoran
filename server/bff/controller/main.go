package controller

import (
	"io"
	"net/http"
	"strings"

	"com.doran.bff/service"
)

// GET /api/v1/bff/main/init/{userId} => /api/v1/bff/main/init/123
func InitMain(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get userId from path
	userId := r.URL.Path[len("/api/v1/bff/main/init/"):]
	if userId == "" {
		http.Error(w, "userId is required", http.StatusBadRequest)
		return
	}

}

// GET /api/v1/bff/main/league-settlement/{userId} => /api/v1/bff/main/league-settlement/123
func LeagueSettlement(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userId := parts[0]

	req, err := service.GetLeagueSettlementService(userId)
	if err != nil {
		http.Error(w, "Error sending request", http.StatusInternalServerError)
		return
	}
	defer req.Body.Close()

	// forward response body to client
	_, err = io.Copy(w, req.Body)
	if err != nil {
		http.Error(w, "Error forwarding response", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

}

// // PATCH /api/v1/bff/main/league-settlement/confirm/{userId} => /api/v1/bff/main/league-settlement/confirm/123
// func ConfirmLeagueSettlement(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPatch {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	// get userId from path
// 	userId := r.URL.Path[len("/api/v1/bff/main/league-settlement/confirm/"):]
// 	if userId == "" {
// 		http.Error(w, "userId is required", http.StatusBadRequest)
// 		return
// 	}

// }
