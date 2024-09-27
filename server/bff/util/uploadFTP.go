package util

import (
	"fmt"
	"log"
	"mime/multipart"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jlaffaye/ftp"
)

func UploadFTP(fileName string, fileData multipart.File) (string, error) {
	username := os.Getenv("FTP_USERNAME")
	password := os.Getenv("FTP_PASSWORD")

	hostname := os.Getenv("FTP_HOST")
	port := "21"

	addr := fmt.Sprintf("%s:%s", hostname, port)
	c, err := ftp.Dial(addr, ftp.DialWithTimeout(5*time.Second))
	if err != nil {
		log.Fatalf("FTP 연결 실패: %v", err)
		return "", err
	}
	defer c.Quit()

	err = c.Login(username, password)
	if err != nil {
		log.Fatalf("FTP 로그인 실패: %v", err)
		return "", err
	}

	uuid := uuid.New().String()
	filenameSplit := strings.Split(fileName, ".")
	ext := filenameSplit[len(filenameSplit)-1]
	fileName = fmt.Sprintf("%s_%d.%s", uuid, time.Now().Unix(), ext)

	err = c.Stor(fileName, fileData)
	if err != nil {
		log.Fatalf("FTP 파일 업로드 실패: %v", err)
		return "", err
	}

	return fileName, nil

}
