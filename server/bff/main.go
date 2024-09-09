package main

import (
	"context"
	"io"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
)

var (
	kafkaBroker  = "kafka.event-queue.svc.cluster.local:9092"
	kafkaWriters = map[string]*kafka.Writer{
		"service-a": kafka.NewWriter(kafka.WriterConfig{
			Brokers: []string{kafkaBroker},
			Topic:   "service-a",
		}),
	}
)

func publishKafkaEvent(topic, message, correlationID string) error {
	writer, exists := kafkaWriters[topic]
	if !exists {
		log.Printf("Kafka writer for topic %s does not exist", topic)
		return nil
	}

	msg := kafka.Message{
		Key:   []byte(correlationID),
		Value: []byte(message),
	}

	err := writer.WriteMessages(context.Background(), msg)
	if err != nil {
		log.Printf("Error writing message to Kafka: %v", err)
	}
	return err
}

func publishKafkaEventAsync(topic, message, correlationID string) {
	go func() {
		if err := publishKafkaEvent(topic, message, correlationID); err != nil {
			log.Printf("Failed to send Kafka event asynchronously: %v", err)
		}
	}()
}

func closeKafkaWriters() {
	for _, writer := range kafkaWriters {
		writer.Close()
	}
}

func main() {
	http.HandleFunc("/api/v1/bff/test1", handleTest1)
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	defer closeKafkaWriters()

	log.Println("BFF Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleTest1(w http.ResponseWriter, r *http.Request) {
	correlationID := uuid.New().String()

	w.WriteHeader(http.StatusOK)
	io.WriteString(w, "Kafka event published : "+correlationID)
}
