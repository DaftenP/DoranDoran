package controller

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"

	"com.doran.bff/service"
)

// GET /api/v1/bff/store/item-list
// func GetItemList(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodGet {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}

// }

// POST /api/v1/bff/store/buy
func BuyItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
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

	var userIdInt int
	userIdInt, err = strconv.Atoi(userId)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusInternalServerError)
		return
	}

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

	req, err := service.BuyItemService(userIdInt, int(itemType.(float64)), int(itemId.(float64)))
	if err != nil {
		http.Error(w, "Error sending request", http.StatusInternalServerError)
		return
	}
	defer req.Body.Close()

	//forward response body to client
	_, err = io.Copy(w, req.Body)
	if err != nil {
		http.Error(w, "Error forwarding response", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(req.StatusCode)
}
