package api

import (
	"net/http"
)

// PUT /api/v1/bff/my-page/user
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}

// GET /api/v1/bff/my-page/user/{userId}
func GetUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get userId from path
	userId := r.URL.Path[len("/api/v1/bff/my-page/user/"):]
	if userId == "" {
		http.Error(w, "userId is required", http.StatusBadRequest)
		return
	}

}

// DELETE /api/v1/bff/my-page/user
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}

// GET /api/v1/bff/my-page/password
func RequestPasswordChange(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}

// POST /api/v1/bff/my-page/password
func ChangePassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}

// GET /api/v1/bff/my-page/solve
func GetSolved(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}
