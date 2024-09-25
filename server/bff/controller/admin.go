package controller

import (
	"io"
	"net/http"

	"com.doran.bff/service"
)

// GET /api/v1/bff/admin/quiz?seed=1234&prompt=asdf-qwer-zxcv
func GenerateQuizController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	seed := r.URL.Query().Get("seed")
	prompt := r.URL.Query().Get("prompt")

	quizRes, err := service.QuizService(seed, prompt)
	if err != nil {
		http.Error(w, "Error calling QuizService", http.StatusInternalServerError)
		return
	}

	io.WriteString(w, quizRes)
}
