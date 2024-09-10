package controller

import (
	"net/http"
)

// GET /api/v1/bff/inventory/item
func GetItems(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

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
