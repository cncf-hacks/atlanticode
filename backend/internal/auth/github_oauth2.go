package auth

import (
	"context"
	"dvloper/paris-backend/config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

var (
	githubConf *oauth2.Config = &oauth2.Config{
		ClientID:     config.Get().GithubClientID,
		ClientSecret: config.Get().GithubClientSecret,
		RedirectURL:  fmt.Sprintf("%s/github_callback", config.Get().ApiURL),
		Scopes:       []string{"read:user", "user:email"},
		Endpoint:     github.Endpoint,
	}
)

type GithubUser struct {
	ID      int    `json:"id"`
	Email   string `json:"email,omitempty"`
	Name    string `json:"name"`
	Picture string `json:"avatar_url"`
}

func HandleGithubLogin(w http.ResponseWriter, r *http.Request) {
	url := githubConf.AuthCodeURL(oauthStateString)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func HandleGithubCallback(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	content, err := getGhUserInfo(r.FormValue("state"), r.FormValue("code"))
	if err != nil {
		fmt.Println(err.Error())
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	fmt.Printf("Content: %s\n", content)

	var user GithubUser
	err = json.Unmarshal(content, &user)
	if err != nil {
		fmt.Println(err.Error())
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	if user.Email == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Email is required"))
		return
	}

	// TODO: Save user to database

	// Create session token
	token, err := CreateToken(User{
		ID:      strconv.Itoa(user.ID),
		Email:   user.Email,
		Name:    user.Name,
		Picture: user.Picture,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// // Return session token in JSON response
	// fmt.Println("Returning session token")

	// var tokenRes TokenResponse = TokenResponse{Token: token}
	// buf, err := json.Marshal(tokenRes)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// w.Write(buf)
	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    token,
		Path:     "/",
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode, // Mitigates CSRF attacks
	})

	// Redirect to the frontend application
	frontendRedirectURL := "http://localhost:4200/auth/loading/" + user.Name
	http.Redirect(w, r, frontendRedirectURL, http.StatusSeeOther)
}

func getGhUserInfo(state string, code string) ([]byte, error) {
	if state != oauthStateString {
		return nil, fmt.Errorf("invalid oauth state")
	}

	token, err := githubConf.Exchange(context.Background(), code)
	if err != nil {
		return nil, fmt.Errorf("code exchange failed: %s", err.Error())
	}

	client := githubConf.Client(context.Background(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		return nil, fmt.Errorf("failed getting user info: %s", err.Error())
	}

	defer resp.Body.Close()

	content, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed reading response body: %s", err.Error())
	}

	return content, nil
}
