package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"com.doran.bff/model"
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

	var randomItemRequestFromClient model.RandomItemRequestFromClient
	err = json.Unmarshal(body, &randomItemRequestFromClient)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	resp, err := service.GetRandomItem(strconv.Itoa(randomItemRequestFromClient.ItemType))
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in GetRandomItem")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if resp.StatusCode != http.StatusOK {
		w.WriteHeader(resp.StatusCode)
		return
	}

	var randomItemResponseFromMSA model.RandomItemResponseFromMSA
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in io.ReadAll")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(body, &randomItemResponseFromMSA)
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in json.Unmarshal")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	itemId := randomItemResponseFromMSA.Data.Chosen

	resp, err = service.BuyItemService(userIdInt, randomItemRequestFromClient.ItemType, itemId)
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in BuyItemService")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if resp.StatusCode != http.StatusOK {
		w.WriteHeader(http.StatusOK)
		io.Copy(w, resp.Body)
		return
	}

	w.WriteHeader(http.StatusOK)

	// new response looks like: {"data": $itemId, "message": responseMessage, "timestamp": $timestamp}
	jsonToClient := map[string]interface{}{
		"data":      itemId,
		"message":   "Item bought successfully",
		"timestamp": randomItemResponseFromMSA.Timestamp,
	}

	jsonToClientStr, err := json.Marshal(jsonToClient)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Write(jsonToClientStr)
}
