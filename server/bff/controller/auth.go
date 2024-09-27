package controller

import (
	"net/http"

	"com.doran.bff/service"
	"com.doran.bff/util"
)

// POST /api/v1/bff/reissue
func Reissue(w http.ResponseWriter, r *http.Request) {
	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/user/reissue")
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
