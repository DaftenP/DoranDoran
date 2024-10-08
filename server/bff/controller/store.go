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

	var itemType string = strconv.Itoa(randomItemRequestFromClient.ItemType)

	resp, err := service.GetRandomItem(itemType)
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

	resp, err = service.GetItemSpec(itemType, strconv.Itoa(itemId))
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in GetItemSpec")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if resp.StatusCode != http.StatusOK {
		w.WriteHeader(resp.StatusCode)
		return
	}

	var itemInfoResponseFromMSA model.ItemInfoResponseFromMSA
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in io.ReadAll")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(body, &itemInfoResponseFromMSA)
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in json.Unmarshal")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var itemPrice int = itemInfoResponseFromMSA.Data.Price

	resp, err = service.BuyItemService(userIdInt, randomItemRequestFromClient.ItemType, itemId, itemPrice)
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in BuyItemService")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var respBody map[string]interface{}
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in io.ReadAll")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(body, &respBody)
	if err != nil {
		fmt.Println(err)
		fmt.Println("error in json.Unmarshal")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var message string = "구매 완료"

	if respBody["message"] != nil {
		message = respBody["message"].(string)
	}

	w.WriteHeader(resp.StatusCode)

	jsonToClient := map[string]interface{}{
		"data":      itemId,
		"message":   message,
		"timestamp": randomItemResponseFromMSA.Timestamp,
	}

	jsonToClientStr, err := json.Marshal(jsonToClient)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Write(jsonToClientStr)
}
