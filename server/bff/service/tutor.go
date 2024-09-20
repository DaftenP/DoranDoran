package service

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
)

var (
	url = "http://tutor.ns-tutor.svc.cluster.local:8080"
)

// POST url/api/v1/ai-tutor/send
func SendService(messages, userMessage json.RawMessage, role, situation string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, url+"/api/v1/tutor/send"+"?role="+role+"&situation="+situation, nil)
	if err != nil {
		return nil, err
	}

	// make json with messages and userMessage
	jsonStr, err := json.Marshal(map[string]json.RawMessage{
		"messages":    messages,
		"userMessage": userMessage,
	})
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Body = io.NopCloser(bytes.NewBuffer(jsonStr))

	return http.DefaultClient.Do(req)
}

// GET url/api/v1/ai-tutor/pronunciation. get multipart/file void as parameter, make request with file and return response
func PronunciationService(voice multipart.File) (*http.Response, error) {
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	part, err := writer.CreateFormFile("file", "voice.wav")
	if err != nil {
		return nil, err
	}

	_, err = io.Copy(part, voice)
	if err != nil {
		return nil, err
	}

	err = writer.Close()
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(http.MethodGet, url+"/api/v1/tutor/pronunciation", &body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	return http.DefaultClient.Do(req)
}
