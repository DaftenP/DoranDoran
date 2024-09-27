package main

import (
	"log"
	"net/http"

	"com.doran.bff/controller"
	"com.doran.bff/middleware"
)

func main() {
	http.HandleFunc("/api/v1/bff/regist", controller.Regist)
	http.HandleFunc("/api/v1/bff/login", controller.Login)

	http.HandleFunc("/api/v1/bff/mail/regist", controller.RegistMailController)
	http.HandleFunc("/api/v1/bff/mail/password", controller.PasswordMailController)
	http.HandleFunc("/api/v1/bff/mail/check", controller.CheckMailController)
	http.HandleFunc("/api/v1/bff/mail/reset", controller.ResetMailController)

	http.HandleFunc("/api/v1/bff/my-page/user", controller.DeleteUserController)

	http.Handle("/api/v1/bff/admin/quiz", middleware.JWTMiddleware(http.HandlerFunc(controller.GenerateQuizController)))

	http.Handle("/api/v1/bff/talk/send", middleware.JWTMiddleware(http.HandlerFunc(controller.SendController)))

	http.Handle("/api/v1/bff/quiz/quizzes", middleware.JWTMiddleware(http.HandlerFunc(controller.GetQuizzes)))
	http.Handle("/api/v1/bff/quiz/quizzes/", middleware.JWTMiddleware(http.HandlerFunc(controller.GetQuiz)))
	http.Handle("/api/v1/bff/quiz/play-log/submit", middleware.JWTMiddleware(http.HandlerFunc(controller.SubmitPlayLog)))
	http.Handle("/api/v1/bff/quiz/play-log/", middleware.JWTMiddleware(http.HandlerFunc(controller.GetPlayLog)))

	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	log.Println("BFF Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
