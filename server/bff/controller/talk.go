package controller

import (
	"net/http"
)

// POST /api/v1/bff/talk/dialog
func Dialog(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}
