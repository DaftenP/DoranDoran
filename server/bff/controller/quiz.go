package controller

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"strings"

	"com.doran.bff/service"
	"com.doran.bff/util"
)

// GET /api/v1/bff/quiz/quizzes/{quizId}
func GetQuiz(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// split the URL path '/'
	quizIdList := strings.Split(r.URL.Path, "/")
	quizId := quizIdList[len(quizIdList)-1]

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

// GET /api/v1/bff/quiz/play-log
func GetPlayLog(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		fmt.Println(err)
		return
	}

	parts := strings.Split(cookie.Value, ":")
	userID := parts[0]

	util.ForwardRequest(w, r, http.MethodGet, service.QuizUrl+"/api/v1/quiz/play-log/"+userID)
}

// POST /api/v1/bff/quiz/quizzes/regist
func RegistQuizController(w http.ResponseWriter, r *http.Request) {
	fmt.Println("RegistQuizController")
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get request body from form field
	quizInfo := r.FormValue("quizInfo") // json
	if quizInfo == "" {
		http.Error(w, "quizInfo is required", http.StatusBadRequest)
		return
	}

	// get voice and images from multipart/form-data
	voice, header, err := r.FormFile("voice")
	if err != nil {
		http.Error(w, "voice is required", http.StatusBadRequest)
		return
	}

	imageList := []multipart.File{}
	imageHeaderList := []*multipart.FileHeader{}
	for i := 1; i < 5; i++ {
		image, header, err := r.FormFile("image" + fmt.Sprint(i))
		if err != nil {
			break
		}
		imageList = append(imageList, image)
		imageHeaderList = append(imageHeaderList, header)
	}

	res, err := service.RegistQuizService(quizInfo, voice, header, imageList, imageHeaderList)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// return response from MSA to client
	w.WriteHeader(res.StatusCode)
	util.CopyHeader(w.Header(), res.Header)
	util.CopyBody(w, res.Body)

	defer res.Body.Close()
}
