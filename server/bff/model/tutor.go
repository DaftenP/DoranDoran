package model

type TalkResponseToClient struct {
	Data      TalkResponseToClientData `json:"data"`
	Message   string                   `json:"message"`
	Timestamp string                   `json:"timestamp"`
}

type TalkResponseToClientData struct {
	Pronunciation      float64 `json:"pronunciation"`
	TutorResponse      string  `json:"tutorResponse"`
	TranslatedResponse string  `json:"translatedResponse"`
	Hint               string  `json:"hint"`
	TranslatedHint     string  `json:"translatedHint"`
	IsOver             bool    `json:"isOver"`
	Correctness        float64 `json:"correctness"`
}

////////////////////////////////////////

type TutorSendResponse struct {
	Data      TutorSendResponseData `json:"data"`
	Message   string                `json:"message"`
	Timestamp string                `json:"timestamp"`
}

type TutorSendResponseData struct {
	TutorResponse      string  `json:"tutorResponse"`
	TranslatedResponse string  `json:"translatedResponse"`
	Hint               string  `json:"hint"`
	TranslatedHint     string  `json:"translatedHint"`
	IsOver             bool    `json:"isOver"`
	Correctness        float64 `json:"correctness"`
}

type TutorPronunciationResponse struct {
	Data      float64 `json:"data"`
	Message   string  `json:"message"`
	Timestamp string  `json:"timestamp"`
}
