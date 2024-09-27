package model

type QuizRegistRequestToMSA struct {
	QuizQuestion string      `json:"quizQuestion"`
	QuizAnswer   string      `json:"quizAnswer"`
	QuizCategory int64       `json:"quizCategory"`
	QuizType     int64       `json:"quizType"`
	QuizVoiceUrl string      `json:"quizVoiceUrl"`
	QuizImages   []QuizImage `json:"quizImages"`
}

type QuizImage struct {
	QuizImageUrl string `json:"quizImageUrl"`
}

type QuizInfo struct {
	QuizQuestion string `json:"quizQuestion"`
	QuizAnswer   string `json:"quizAnswer"`
	QuizCategory int64  `json:"quizCategory"`
	QuizType     int64  `json:"quizType"`
}
