package main

import (
	"dvloper/paris-backend/internal/auth"
	"dvloper/paris-backend/pkg/executor"
	"fmt"
	"net/http"
)

func main() {

	// new_user := repository.UserDB{
	// 	Name:    "miau",
	// 	Picture: "miau",
	// 	Email:   "miau@miau.miau",
	// 	ID:      "miau",
	// }

	// new_user.CreateUser()

	auth.Init()
	executor.Init()
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println(err)
	}
}
