package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"

	"com.doran.bff/service"
	"com.doran.bff/util"
)

// GET /api/v1/bff/quiz/quizzes/{quizId}
func GetQuizController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// split the URL path '/'
	quizIdList := strings.Split(r.URL.Path, "/")
	quizId := quizIdList[len(quizIdList)-1]

	util.ForwardRequest(w, r, http.MethodGet, service.QuizUrl+"/api/v1/quiz/quizzes/"+quizId)
}

// GET /api/v1/bff/quiz/quizzes?quiz_type=10&quiz_category=10&cnt=10
func GetQuizzesController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var quizType, quizCategory, cnt string
	if r.URL.Query().Get("quiz_type") != "" {
		quizType = r.URL.Query().Get("quiz_type")
	}
	if r.URL.Query().Get("quiz_category") != "" {
		quizCategory = r.URL.Query().Get("quiz_category")
	}
	if r.URL.Query().Get("cnt") != "" {
		cnt = r.URL.Query().Get("cnt")
	}

	util.ForwardRequest(w, r, http.MethodGet, service.QuizUrl+"/api/v1/quiz/quizzes?quiz_type="+quizType+"&quiz_category="+quizCategory+"&cnt="+cnt)
}

// POST /api/v1/bff/quiz/play-log/submit
func SubmitPlayLogController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userID := parts[0]

	userIdInt, err := strconv.Atoi(userID)
	if err != nil {
		http.Error(w, "Invalid userId", http.StatusBadRequest)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusInternalServerError)
		return
	}

	quizId, ok := data["quizId"].(float64)
	if !ok {
		http.Error(w, "Invalid quizId", http.StatusBadRequest)
		return
	}

	res, err := service.SubmitPlayLogService(userIdInt, int(quizId))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// return response from MSA to client
	w.WriteHeader(res.StatusCode)
	util.CopyHeader(w.Header(), res.Header)
	io.Copy(w, res.Body)

	defer res.Body.Close()
}

// GET /api/v1/bff/quiz/play-log
func GetPlayLogController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userID := parts[0]

	util.ForwardRequest(w, r, http.MethodGet, service.UserUrl+"/api/v1/user/play-log/"+userID)
}

// POST /api/v1/bff/quiz/quizzes/regist
func RegistQuizController(w http.ResponseWriter, r *http.Request) {
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

// GET /api/v1/bff/quiz/stage/all
func GetAllStageController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	util.ForwardRequest(w, r, http.MethodGet, service.QuizUrl+"/api/v1/quiz/stage/all")
}

// GET /api/v1/bff/quiz/stage/{stageId}
func GetStageController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// split the URL path '/'
	stageIdList := strings.Split(r.URL.Path, "/")
	stageId := stageIdList[len(stageIdList)-1]

	util.ForwardRequest(w, r, http.MethodGet, service.QuizUrl+"/api/v1/quiz/stage/"+stageId)
}
