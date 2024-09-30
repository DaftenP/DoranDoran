FROM golang:1.23.0-alpine AS builder

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bff main.go

FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=builder /app/bff /bff

COPY --from=builder /app/service-account-key.json /service-account-key.json

ENV GOOGLE_APPLICATION_CREDENTIALS=/service-account-key.json

CMD ["/bff"]