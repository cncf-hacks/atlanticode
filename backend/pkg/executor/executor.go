package executor

import (
	"bytes"
	"context"
	"dvloper/paris-backend/config"
	"dvloper/paris-backend/pkg/repository"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/aidarkhanov/nanoid"
	core "k8s.io/api/core/v1"
	networkingv1 "k8s.io/api/networking/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
)

const RFC1123Alphabet = "0123456789-abcdefghijklmnopqrstuvwxyz"

var CHAT_ROUTE = config.Get().OllamaURL + "/api/chat"

type CreateModelBody struct {
	Model  string `json:"model"`
	Stream bool   `json:"stream"`
}

type Executor struct {
	ID      string    `json:"id"`
	ExpDate time.Time `json:"exp_date"`
	Model   string    `json:"model"`
}

type OllamaMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OllamaRunRequest struct {
	Model    string          `json:"model"`
	Messages []OllamaMessage `json:"messages"`
	Stream   bool            `json:"stream"`
}

type OllamaResponse struct {
	Model   string        `json:"model"`
	Message OllamaMessage `json:"message"`
}

// Instantiates a pod with the specified Ollama model
// and returns the URL
func (e Executor) Create() (string, error) {
	// Create id
	id, err := nanoid.Generate(RFC1123Alphabet, 10)
	if err != nil {
		return "", errors.New("Error generating id: " + err.Error())
	}

	e.ID = id

	fmt.Printf("Creating executor: %s\n", e)

	c := config.Get().K8SClient

	// Create a pod object using the provided model
	pod := getPodObject(e.ID)
	createdPod, err := c.CoreV1().Pods("ollama").Create(context.Background(), pod, v1.CreateOptions{})

	if err != nil {
		return "", errors.New("Error creating pod: " + err.Error())
	}

	fmt.Printf("Created pod: %s\n", createdPod.Name)

	// Create a service object
	service := getServiceObject(e.ID)
	createdService, err := c.CoreV1().Services("ollama").Create(context.Background(), service, v1.CreateOptions{})
	if err != nil {
		return "", errors.New("Error creating service: " + err.Error())
	}

	fmt.Printf("Created service: %s\n", createdService.Name)

	// Create an ingress object
	ingress := getIngress(e.ID)
	createdIngress, err := c.NetworkingV1().Ingresses("ollama").Create(context.Background(), ingress, v1.CreateOptions{})
	if err != nil {
		return "", errors.New("Error creating ingress: " + err.Error())
	}

	fmt.Printf("Created ingress: %s\n", createdIngress.Name)

	fmt.Printf("Pulling model image: %s\n", e.Model)
	time.Sleep(3 * time.Second)
	err = pullModel(e.Model, e.ID)
	if err != nil {
		return "", errors.New("Error pulling model: " + err.Error())
	}

	// TODO: Create cronjob to delete the pod after the expiration date

	// Add executor to the database
	eDb := repository.ExecutorDB{
		ID:      id,
		ExpDate: e.ExpDate,
		LLM:     e.Model,
	}

	err = eDb.CreateExecutor()
	if err != nil {
		return "", errors.New("Error creating executor: " + err.Error())
	}

	return id, nil
}

// Interacts with Ollama API, passes the input prompt
// and returns the model's response
func (e Executor) Run(messages []OllamaMessage) (OllamaResponse, error) {
	/*
		TODO: Currently, this function sends a request to Ollama API of the pod
		deployed initially in the cluster, and does nothing to link the received
		executor id to a specific pod. Change this behaviour once proper
		networking is implemented.
	*/
	fmt.Printf("Running executor: %s\n", e)

	client := &http.Client{}

	r := OllamaRunRequest{
		Model:    e.Model,
		Messages: messages,
		Stream:   false,
	}

	// Create a request to Ollama API
	body, err := json.Marshal(r)
	if err != nil {
		return OllamaResponse{}, errors.New("Error marshalling request: " + err.Error())
	}

	req, err := http.NewRequest("POST", "https://ollama-"+e.ID+"."+CHAT_ROUTE, bytes.NewBuffer(body))
	if err != nil {
		return OllamaResponse{}, errors.New("Error creating request: " + err.Error())
	}

	req.Header.Set("Content-Type", "application/json")

	fmt.Printf("Sending request: %s\n", req)

	resp, err := client.Do(req)
	if err != nil {
		return OllamaResponse{}, errors.New("Error sending request: " + err.Error())
	}

	fmt.Printf("Received response: %s\n", resp)

	defer resp.Body.Close()

	// Parse the response
	var ollamaResp OllamaResponse
	var bodyBytes []byte
	bodyBytes, err = io.ReadAll(resp.Body)
	if err != nil {
		return OllamaResponse{}, errors.New("Error reading response: " + err.Error())
	}

	err = json.Unmarshal(bodyBytes, &ollamaResp)
	if err != nil {
		return OllamaResponse{}, errors.New("Error unmarshalling response: " + err.Error())
	}

	fmt.Printf("Received response: %s\n", ollamaResp)

	return ollamaResp, nil
}

func pullModel(model string, id string) error {
	m := CreateModelBody{Model: model, Stream: false}
	body, err := json.Marshal(m)

	if err != nil {
		return errors.New("Error marshalling model: " + err.Error())
	}

	req, err := http.NewRequest("POST", "https://ollama-"+id+"."+config.Get().OllamaURL+"/api/pull", bytes.NewBuffer(body))
	if err != nil {
		return errors.New("Error creating request: " + err.Error())
	}

	req.Header.Set("Content-Type", "application/json")

	fmt.Printf(
		"Sending request to pull model: %s\n",
		req,
	)

	client := &http.Client{}

	res, err := client.Do(req)

	if err != nil {
		return errors.New("Error sending request: " + err.Error())
	}

	if res.StatusCode != 200 {
		return errors.New("Error pulling model: " + res.Status)
	}

	return nil
}

func getPodObject(id string) *core.Pod {
	return &core.Pod{
		ObjectMeta: v1.ObjectMeta{
			Name:      "ollama-" + id,
			Namespace: "ollama",
			Labels: map[string]string{
				"app": "ollama" + id,
			},
		},
		Spec: core.PodSpec{
			Containers: []core.Container{
				{
					Name:            "ollama" + id,
					Image:           "ollama/ollama:latest",
					ImagePullPolicy: core.PullIfNotPresent,
				},
			},
		},
	}
}

func getServiceObject(id string) *core.Service {
	return &core.Service{
		ObjectMeta: v1.ObjectMeta{
			Name:      "ollama-" + id,
			Namespace: "ollama",
			Labels: map[string]string{
				"app": "ollama" + id,
			},
		},
		Spec: core.ServiceSpec{
			Selector: map[string]string{
				"app": "ollama" + id,
			},
			Ports: []core.ServicePort{
				{
					Protocol: "TCP",
					Port:     3000,
					TargetPort: intstr.IntOrString{
						Type:   intstr.Int,
						IntVal: 11434,
					},
				},
			},
			Type: "ClusterIP",
		},
	}
}

func getIngress(id string) *networkingv1.Ingress {
	return &networkingv1.Ingress{
		ObjectMeta: v1.ObjectMeta{
			Name:      "ollama-" + id,
			Namespace: "ollama",
			Labels: map[string]string{
				"app": "ollama" + id,
			},
		},
		Spec: networkingv1.IngressSpec{
			Rules: []networkingv1.IngressRule{
				{
					Host: "ollama-" + id + ".atlanticode.dev",
					IngressRuleValue: networkingv1.IngressRuleValue{
						HTTP: &networkingv1.HTTPIngressRuleValue{
							Paths: []networkingv1.HTTPIngressPath{
								{
									Path: "/",
									PathType: func() *networkingv1.PathType {
										pt := networkingv1.PathTypePrefix
										return &pt
									}(),
									Backend: networkingv1.IngressBackend{
										Service: &networkingv1.IngressServiceBackend{
											Name: "ollama-" + id,
											Port: networkingv1.ServiceBackendPort{
												Number: 3000,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}
}
