package util

import (
	"context"
	"log"

	"github.com/segmentio/kafka-go"
)

var (
	kafkaBroker  = "kafka.event-queue.svc.cluster.local:9092"
	kafkaWriters = map[string]*kafka.Writer{
		"topic-rank-updateXP": kafka.NewWriter(kafka.WriterConfig{
			Brokers: []string{kafkaBroker},
			Topic:   "topic-rank-updateXP",
		}),
		"topic-user-updateXP": kafka.NewWriter(kafka.WriterConfig{
			Brokers: []string{kafkaBroker},
			Topic:   "topic-user-updateXP",
		}),
		"topic-rank-placement": kafka.NewWriter(kafka.WriterConfig{
			Brokers: []string{kafkaBroker},
			Topic:   "topic-rank-placement",
		}),
	}
)

func publishKafkaEvent(topic, message string) error {
	// Writer 재사용
	writer, exists := kafkaWriters[topic]
	if !exists {
		log.Printf("Kafka writer for topic %s does not exist", topic)
		return nil
	}

	// 메시지 전송
	err := writer.WriteMessages(context.Background(), kafka.Message{
		Value: []byte(message),
	})
	if err != nil {
		return err
	}

	return nil
}

func PublishKafkaEventAsync(topic, message string) {
	go func() {
		if err := publishKafkaEvent(topic, message); err != nil {
			log.Printf("Failed to send Kafka event asynchronously: %v", err)
		}
	}()
}

func CloseKafkaWriters() {
	for _, writer := range kafkaWriters {
		writer.Close()
	}
}
