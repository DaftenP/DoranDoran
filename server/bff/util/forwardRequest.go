package util

import (
	"io"
	"net/http"
)

func ForwardRequest(w http.ResponseWriter, r *http.Request, method, targetURL string) {
	req, err := http.NewRequest(method, targetURL, r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	CopyHeader(r.Header, req.Header)

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	CopyHeader(resp.Header, w.Header())

	w.WriteHeader(resp.StatusCode)

	io.Copy(w, resp.Body)
}

func CopyHeader(src, dst http.Header) {
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}

func CopyBody(dst io.Writer, src io.Reader) {
	io.Copy(dst, src)
}
