package main

import (
	"log"
	"net/http"

	"com.doran.bff/controller"
	"com.doran.bff/middleware"
)

func main() {
	http.HandleFunc("/api/v1/bff/reissue", controller.ReissueController)
	http.HandleFunc("/api/v1/bff/regist", controller.RegistController)
	http.HandleFunc("/api/v1/bff/login", controller.LoginController)
	http.HandleFunc("/api/v1/bff/logout", controller.LogoutController)

	http.Handle("/api/v1/bff/tts", middleware.JWTMiddleware(http.HandlerFunc(controller.GenerateTTSController)))

	http.HandleFunc("/api/v1/bff/mail/regist", controller.RegistMailController)
	http.HandleFunc("/api/v1/bff/mail/password", controller.PasswordMailController)
	http.HandleFunc("/api/v1/bff/mail/check", controller.CheckMailController)
	http.HandleFunc("/api/v1/bff/mail/reset", controller.ResetMailController)

	http.Handle("/api/v1/bff/my-page/user", middleware.JWTMiddleware(http.HandlerFunc(controller.DeleteUserController)))

	http.Handle("/api/v1/bff/admin/quiz", middleware.JWTMiddleware(http.HandlerFunc(controller.GenerateQuizController)))

	http.Handle("/api/v1/bff/talk/send", middleware.JWTMiddleware(http.HandlerFunc(controller.SendController)))

	http.Handle("/api/v1/bff/quiz/quizzes/regist", middleware.JWTMiddleware(http.HandlerFunc(controller.RegistQuizController)))
	http.Handle("/api/v1/bff/quiz/quizzes", middleware.JWTMiddleware(http.HandlerFunc(controller.GetQuizzesController)))
	http.Handle("/api/v1/bff/quiz/quizzes/", middleware.JWTMiddleware(http.HandlerFunc(controller.GetQuizController)))
	http.Handle("/api/v1/bff/quiz/play-log/submit", middleware.JWTMiddleware(http.HandlerFunc(controller.SubmitPlayLogController)))
	http.Handle("/api/v1/bff/quiz/play-log/", middleware.JWTMiddleware(http.HandlerFunc(controller.GetPlayLogController)))
	http.Handle("/api/v1/bff/quiz/stage/all", middleware.JWTMiddleware(http.HandlerFunc(controller.GetAllStageController)))
	http.Handle("/api/v1/bff/quiz/stage/{stageId}", middleware.JWTMiddleware(http.HandlerFunc(controller.GetStageController)))

	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	log.Println("BFF Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
