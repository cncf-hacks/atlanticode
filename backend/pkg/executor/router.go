package executor

import "net/http"

func Init() {
	http.HandleFunc("/executor", HandleExecutorCreation)
	http.HandleFunc("/executor/run", HandleExecutorRun)
}
