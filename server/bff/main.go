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

	http.Handle("/api/v1/bff/talk/send", middleware.JWTMiddleware(http.HandlerFunc(controller.SendController)))

	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	log.Println("BFF Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
