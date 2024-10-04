package controller

import (
	"encoding/json"
	"io"
	"net/http"

	"com.doran.bff/service"
	"com.doran.bff/util"
)

// POST /api/v1/bff/reissue
func ReissueController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/user/reissue")
}

// POST /api/v1/bff/regist
func RegistController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
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

	email, ok := data["email"]
	if !ok {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	password, ok := data["password"]
	if !ok {
		http.Error(w, "Password is required", http.StatusBadRequest)
		return
	}

	nickname, ok := data["nickname"]
	if !ok {
		http.Error(w, "Nickname is required", http.StatusBadRequest)
		return
	}

	resp, err := service.RegistService(email.(string), password.(string), nickname.(string))
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	body, err = io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		w.WriteHeader(resp.StatusCode)
		w.Write(body)
		return
	}

	var response map[string]interface{}
	err = json.Unmarshal(body, &response)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	userId, ok := response["data"].(map[string]interface{})["userId"]
	if !ok {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	userIdInt, ok := userId.(float64)
	if !ok {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	jsonToRank := map[string]interface{}{
		"userId": userIdInt,
	}

	jsonToRankStr, err := json.Marshal(jsonToRank)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	util.PublishKafkaEventAsync("topic-rank-placement", string(jsonToRankStr))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(body)
}

// POST /api/v1/bff/login
func LoginController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/user/login")
}

// GET /api/v1/bff/logout
func LogoutController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:   "refresh",
		Value:  "",
		MaxAge: -1,
	})

	w.WriteHeader(http.StatusOK)
}

// POST /api/v1/bff/login/social
func SocialLoginController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

// POST /api/v1/bff/regist/social
func SocialRegistController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}
