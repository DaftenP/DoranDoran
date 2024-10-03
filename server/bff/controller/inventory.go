package controller

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"

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

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusInternalServerError)
		return
	}

	// get itemType and itemId from request body
	itemType, ok := data["itemType"]
	if !ok {
		http.Error(w, "Invalid item type", http.StatusBadRequest)
		return
	}

	itemId, ok := data["itemId"]
	if !ok {
		http.Error(w, "Invalid item ID", http.StatusBadRequest)
		return
	}

	req, err := service.EquipItemService(userId, itemType.(string), itemId.(string))
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
