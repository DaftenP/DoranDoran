package controller

import (
	"net/http"

	"com.doran.bff/service"
	"com.doran.bff/util"
)

// POST /api/v1/bff/mail/regist
func RegistMailController(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/mail/regist?email="+email)
}

// POST /api/v1/bff/mail/password
func PasswordMailController(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	util.ForwardRequest(w, r, "POST", service.UserUrl+"/api/v1/mail/password?email="+email)
}
