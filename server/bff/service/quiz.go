package service

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"

	"com.doran.bff/model"
	"com.doran.bff/util"
)

var (
	QuizUrl = "http://quiz.ns-quiz.svc.cluster.local:8080"
)

// POST /api/v1/quiz/quizzes/regist
func RegistQuizService(quizInfo string, voice multipart.File, voiceHeader *multipart.FileHeader, images []multipart.File, imagesHeaders []*multipart.FileHeader) (*http.Response, error) {
	var quizInfoJson model.QuizInfo
	if err := json.Unmarshal([]byte(quizInfo), &quizInfoJson); err != nil {
		return nil, err
	}

	voiceFileName, err := util.UploadFTP(voiceHeader.Filename, voice)
	if err != nil {
		return nil, err
	}
	voiceFileName = "https://ssafy-tailored.b-cdn.net/" + voiceFileName

	var imageFileNames []string
	for i, image := range images {
		imageFileName, err := util.UploadFTP(imagesHeaders[i].Filename, image)
		if err != nil {
			return nil, err
		}
		imageFileNames = append(imageFileNames, imageFileName)
	}

	var requestBody model.QuizRegistRequestToMSA
	requestBody.QuizQuestion = quizInfoJson.QuizQuestion
	requestBody.QuizAnswer = quizInfoJson.QuizAnswer
	requestBody.QuizCategory = quizInfoJson.QuizCategory
	requestBody.QuizType = quizInfoJson.QuizType
	requestBody.QuizVoiceUrl = voiceFileName

	for _, imageFileName := range imageFileNames {
		requestBody.QuizImages = append(requestBody.QuizImages, model.QuizImage{
			QuizImageUrl: "https://ssafy-tailored.b-cdn.net/" + imageFileName,
		})
	}

	reqBody, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(http.MethodPost, QuizUrl+"/api/v1/quiz/quizzes/regist", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Body = io.NopCloser(bytes.NewBuffer(reqBody))

	return http.DefaultClient.Do(req)
}
