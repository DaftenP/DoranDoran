package model

type TutorSendResponse struct {
	Data      TutorSendResponseData `json:"data"`
	Message   string                `json:"message"`
	Timestamp string                `json:"timestamp"`
}

type TutorSendResponseData struct {
	TutorResponse string  `json:"tutorResponse"`
	IsOver        bool    `json:"isOver"`
	Correctness   float64 `json:"correctness"`
}

type TutorPronunciationResponse struct {
	Data    TutorPronunciationResponseData `json:"data"`
	Message string                         `json:"message"`
}

type TutorPronunciationResponseData struct {
	Pronunciation float64 `json:"pronunciation"`
}

type TutorCombinedResponse struct {
	Data    TutorCombinedResponseData `json:"data"`
	Message string                    `json:"message"`
}

type TutorCombinedResponseData struct {
	Correctness   float64 `json:"correctness"`
	Pronunciation float64 `json:"pronunciation"`
	TutorResponse string  `json:"tutorResponse"`
	IsOver        bool    `json:"isOver"`
}
