package controller

import (
	"fmt"
	"net/http"

	"com.doran.bff/service"
	"com.doran.bff/util"
)

// test api that validates the token
// GET /api/v1/bff/validate
func Validate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	token := r.Header.Get("Access")
	if token == "" {
		fmt.Println("Token is empty")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if !util.ValidateToken(token) {
		fmt.Println("Token is invalid")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// POST /api/v1/bff/regist
func Regist(w http.ResponseWriter, r *http.Request) {
	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/user/regist")
}

// POST /api/v1/bff/login
func Login(w http.ResponseWriter, r *http.Request) {
	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/user/login")
}

// POST /api/v1/bff/login/social
func SocialLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}

// POST /api/v1/bff/regist/social
func SocialRegist(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}
