package controller

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"

	"com.doran.bff/model"
	"com.doran.bff/service"
)

// GET /api/v1/bff/inventory/item
func GetItems(w http.ResponseWriter, r *http.Request) {
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

	resp, err := service.GetItemService(userId)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// return response body to client
	_, err = io.Copy(w, resp.Body)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// PATCH /api/v1/bff/inventory/equip
func EquipItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
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

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var equipRequestFromClient model.EquipRequestFromClient
	err = json.Unmarshal(body, &equipRequestFromClient)
	if err != nil {
		http.Error(w, "Error unmarshalling request body", http.StatusInternalServerError)
		return
	}

	userIdInt, _ := strconv.Atoi(userId)

	req, err := service.EquipItemService(userIdInt, equipRequestFromClient.ItemType, equipRequestFromClient.ItemId)
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
