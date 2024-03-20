package executor

import (
	"dvloper/paris-backend/config"
	"dvloper/paris-backend/pkg/repository"
	bs "encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type ExecutorRunRequest struct {
	Id       string          `json:"id"`
	Messages []OllamaMessage `json:"messages"`
}

type ExecutorCreateRequest struct {
	Model   string    `json:"model"`
	ExpDate time.Time `json:"exp_date"`
}

type ExecutorCreateResponse struct {
	Id string `json:"id"`
}

func SetCorsHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func HandleExecutorCreation(w http.ResponseWriter, r *http.Request) {
	SetCorsHeaders(w)
	envconfig := config.Get()
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", envconfig.ClientURL)

	model := r.URL.Query().Get("model")

	if model == "" {
		http.Error(w, "Model parameter is required", http.StatusBadRequest)
		return
	}

	req := ExecutorCreateRequest{
		Model:   model,
		ExpDate: time.Time{}.Add(10 * 24 * time.Hour),
	}

	e := Executor{
		ExpDate: req.ExpDate,
		Model:   req.Model,
	}

	id, err := e.Create()

	fmt.Println(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := ExecutorCreateResponse{Id: id}

	body, err := json.Marshal(resp)
	if err != nil {
		http.Error(w, "Error marshalling response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

// Parse request body JSON and run the executor
// with the specified messages
func HandleExecutorRun(w http.ResponseWriter, r *http.Request) {
	SetCorsHeaders(w)
	envconfig := config.Get()
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", envconfig.ClientURL)

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Id parameter is required", http.StatusBadRequest)
		return
	}

	m_base64 := r.URL.Query().Get("content")
	if m_base64 == "" {
		http.Error(w, "Content parameter is required", http.StatusBadRequest)
		return
	}

	message, err := bs.URLEncoding.DecodeString(m_base64)
	if err != nil {
		http.Error(w, "Error decoding message: "+err.Error(), http.StatusBadRequest)
		return
	}

	req := ExecutorRunRequest{
		Id: id,
		Messages: []OllamaMessage{
			{
				Role:    "user",
				Content: string(message),
			},
		},
	}

	eDb := repository.ExecutorDB{ID: req.Id}
	err = eDb.FindExecutorById()
	if err != nil {
		http.Error(w, "Error finding executor: "+err.Error(), http.StatusInternalServerError)
		return
	}

	e := Executor{ExpDate: eDb.ExpDate, Model: eDb.LLM, ID: eDb.ID}

	resp, err := e.Run(req.Messages)
	if err != nil {
		http.Error(w, "Error running executor: "+err.Error(), http.StatusInternalServerError)
		return
	}

	respBytes, err := json.Marshal(resp)
	if err != nil {
		http.Error(w, "Error marshalling response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(respBytes)
}
