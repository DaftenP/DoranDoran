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

// GET /api/v1/bff/mail/check?email={email}&userNumber={userNumber}
func CheckMailController(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	userNumber := r.URL.Query().Get("userNumber")
	if email == "" || userNumber == "" {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	util.ForwardRequest(w, r, "GET", service.UserUrl+"/api/v1/mail/check?email="+email+"&userNumber="+userNumber)
}

// PUT /api/v1/bff/mail/reset?email={email}
func ResetMailController(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	util.ForwardRequest(w, r, "PUT", service.UserUrl+"/api/v1/mail/reset?email="+email)
}
