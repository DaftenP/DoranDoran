package controller

import (
	"encoding/json"
	"io"
	"net/http"

	"com.doran.bff/model"
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

	var userRegistRequestFromClient model.UserRegistRequestFromClient
	err = json.Unmarshal(body, &userRegistRequestFromClient)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	email := userRegistRequestFromClient.Email
	password := userRegistRequestFromClient.Password
	nickname := userRegistRequestFromClient.Nickname

	resp, err := service.RegistService(email, password, nickname)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if resp.StatusCode != http.StatusOK {
		w.WriteHeader(resp.StatusCode)
		w.Write(body)
		return
	}

	// print all response body
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var userRegistResponseFromMSA model.UserRegistResponseFromMSA
	err = json.Unmarshal(body, &userRegistResponseFromMSA)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	jsonToRank := map[string]interface{}{
		"userId": userRegistResponseFromMSA.Data,
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
