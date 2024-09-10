package api

import (
	"net/http"
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

	// get userId from path
	userId := r.URL.Path[len("/api/v1/bff/main/league-settlement/"):]
	if userId == "" {
		http.Error(w, "userId is required", http.StatusBadRequest)
		return
	}

}

// PATCH /api/v1/bff/main/league-settlement/confirm/{userId} => /api/v1/bff/main/league-settlement/confirm/123
func ConfirmLeagueSettlement(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get userId from path
	userId := r.URL.Path[len("/api/v1/bff/main/league-settlement/confirm/"):]
	if userId == "" {
		http.Error(w, "userId is required", http.StatusBadRequest)
		return
	}

}
