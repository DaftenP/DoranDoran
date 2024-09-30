package controller

import (
	"net/http"
	"strings"

	"com.doran.bff/service"
	"com.doran.bff/util"
)

// DELETE /api/v1/bff/my-page/user
func DeleteUserController(w http.ResponseWriter, r *http.Request) {
	// get token from cookie named 'refresh'
	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, ":")
	userIdFromCookie := parts[0]

	// trim the leading space
	userIdFromCookie = strings.TrimSpace(userIdFromCookie)

	// forward request to user service
	util.ForwardRequest(w, r, http.MethodDelete, service.UserUrl+"/api/v1/user/delete/"+userIdFromCookie)
}
