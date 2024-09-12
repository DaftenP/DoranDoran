package util

import (
	"context"
	"log"

	"github.com/segmentio/kafka-go"
)

var (
	kafkaWriterPool map[string]*kafka.Writer
)

func publishKafkaEventAsync(topic, key string, value []byte) {
	go func() {
		// if there is no writer for the topic, create a new one
		writer, ok := kafkaWriterPool[topic]
		if !ok {
			writer = kafka.NewWriter(kafka.WriterConfig{
				Brokers: []string{"kafka.event-queue.svc.cluster.local:9092"},
				Topic:   topic,
			})
			kafkaWriterPool[topic] = writer
		}

		// write the message
		err := writer.WriteMessages(context.Background(), kafka.Message{
			Key:   []byte(key),
			Value: value,
		})
		if err != nil {
			log.Println("Error publishing message to Kafka:", err)
		}
	}()
}
