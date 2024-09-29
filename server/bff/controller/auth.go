package controller

import (
	"net/http"

	"com.doran.bff/service"
	"com.doran.bff/util"
)

// POST /api/v1/bff/reissue
func ReissueController(w http.ResponseWriter, r *http.Request) {
	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/user/reissue")
}

// POST /api/v1/bff/regist
func RegistController(w http.ResponseWriter, r *http.Request) {
	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/user/regist")
}

// POST /api/v1/bff/login
func LoginController(w http.ResponseWriter, r *http.Request) {
	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/user/login")
}

// POST /api/v1/bff/logout
func LogoutController(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:   "refresh",
		Value:  "",
		MaxAge: -1,
	})
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
