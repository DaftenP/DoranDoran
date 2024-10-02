package controller

import (
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

// PATCH /api/v1/bff/inventory/equip/{itemId}
func EquipItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get itemId from path
	itemId := r.URL.Path[len("/api/v1/bff/inventory/equip/"):]
	if itemId == "" {
		http.Error(w, "itemId is required", http.StatusBadRequest)
		return
	}

}
