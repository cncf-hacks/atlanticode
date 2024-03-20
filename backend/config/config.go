package config

import (
	"os"

	"github.com/joho/godotenv"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

type Config struct {
	ApiURL             string
	ClientURL          string
	GoogleClientID     string
	GoogleClientSecret string
	GithubClientID     string
	GithubClientSecret string
	JWTSecret          string
	DB_URL             string
	DB_USER            string
	DB_PASSWORD        string
	DB_NAME            string
	DB_PORT            string
	K8SClient          *kubernetes.Clientset
	OllamaURL          string
}

var env *Config = nil

func load() {
	err := godotenv.Load()
	if err != nil {
		panic("Failed to load .env file: " + err.Error())
	}

	apiUrl := os.Getenv("API_URL")
	if apiUrl == "" {
		panic("API_URL is required")
	}

	clientURL := os.Getenv("CLIENT_URL")
	if clientURL == "" {
		panic("CLIENT_URL is required")
	}

	googleClientID := os.Getenv("GOOGLE_CLIENT_ID")
	if googleClientID == "" {
		panic("GOOGLE_CLIENT_ID is required")
	}

	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	if googleClientSecret == "" {
		panic("GOOGLE_CLIENT_SECRET is required")
	}

	githubClientID := os.Getenv("GH_CLIENT_ID")
	if githubClientID == "" {
		panic("GH_CLIENT_ID is required")
	}

	githubClientSecret := os.Getenv("GH_CLIENT_SECRET")
	if githubClientSecret == "" {
		panic("GH_CLIENT_SECRET is required")
	}

	databaseURL := os.Getenv("DB_URL")
	if databaseURL == "" {
		panic("DB_URL is required")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		panic("JWT_SECRET is required")
	}

	kubeconfigPath := os.Getenv("KUBECONFIG_PATH")
	if kubeconfigPath == "" {
		panic("KUBECONFIG_PATH is required")
	}

	ollamaUrl := os.Getenv("OLLAMA_URL")
	if ollamaUrl == "" {
		panic("OLLAMA_URL is required")
	}

	// Set the environment variables
	env = &Config{
		ApiURL:             apiUrl,
		ClientURL:          clientURL,
		GoogleClientID:     googleClientID,
		GoogleClientSecret: googleClientSecret,
		GithubClientID:     githubClientID,
		GithubClientSecret: githubClientSecret,
		DB_URL:             databaseURL,
		JWTSecret:          jwtSecret,
		DB_USER:            os.Getenv("DB_USER"),
		DB_PASSWORD:        os.Getenv("DB_PASSWORD"),
		DB_NAME:            os.Getenv("DB_NAME"),
		DB_PORT:            os.Getenv("DB_PORT"),
		K8SClient:          getK8sConfig(kubeconfigPath),
		OllamaURL:          ollamaUrl,
	}
}

func getK8sConfig(path string) *kubernetes.Clientset {
	config, err := clientcmd.BuildConfigFromFlags("", path)
	if err != nil {
		panic(err)
	}

	client, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	return client
}

func Get() Config {
	if env == nil {
		load()
	}
	return *env
}
