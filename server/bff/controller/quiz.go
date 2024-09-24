package controller

import (
	"net/http"

	"com.doran.bff/service"
	"com.doran.bff/util"
)

// GET /api/v1/bff/quiz/quizzes/{quizId}
func GetQuiz(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	quizId := r.URL.Query().Get("quizId")
	if quizId == "" {
		http.Error(w, "quizId is required", http.StatusBadRequest)
		return
	}

	util.ForwardRequest(w, r, http.MethodGet, service.QuizUrl+"/api/v1/quiz/quizzes/"+quizId)
}

// GET /api/v1/bff/quiz/quizzes
func GetQuizzes(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	util.ForwardRequest(w, r, http.MethodGet, service.QuizUrl+"/api/v1/quiz/quizzes")
}

// POST /api/v1/bff/quiz/play-log/submit
func SubmitPlayLog(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	util.ForwardRequest(w, r, http.MethodPost, service.QuizUrl+"/api/v1/quiz/play-log/submit")
}

// GET /api/v1/bff/quiz/play-log/{userId}
func GetPlayLog(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userId := r.URL.Query().Get("userId")
	if userId == "" {
		http.Error(w, "userId is required", http.StatusBadRequest)
		return
	}

	util.ForwardRequest(w, r, http.MethodGet, service.QuizUrl+"/api/v1/quiz/play-log/"+userId)
}
