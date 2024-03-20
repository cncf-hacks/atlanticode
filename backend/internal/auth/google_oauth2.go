package auth

import (
	"context"
	"dvloper/paris-backend/config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	oauthStateString string         = "random"
	googleConf       *oauth2.Config = &oauth2.Config{
		ClientID:     config.Get().GoogleClientID,
		ClientSecret: config.Get().GoogleClientSecret,
		RedirectURL:  fmt.Sprintf("%s/google_callback", config.Get().ApiURL),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
)

type User struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

func HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	url := googleConf.AuthCodeURL(oauthStateString)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func CookieCheck(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(AuthContextKey("user")).(User)

	buf, err := json.Marshal(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(buf)
}

func HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	content, err := getUserInfo(r.FormValue("state"), r.FormValue("code"))
	if err != nil {
		fmt.Println(err.Error())
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}
	fmt.Printf("Content: %s\n", content)

	var user User
	err = json.Unmarshal(content, &user)
	if err != nil {
		fmt.Println(err.Error())
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	// TODO: Save user to database

	// Create session token
	token, err := CreateToken(user)
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

func getUserInfo(state string, code string) ([]byte, error) {
	if state != oauthStateString {
		return nil, fmt.Errorf("invalid oauth state")
	}

	token, err := googleConf.Exchange(context.Background(), code)
	if err != nil {
		return nil, fmt.Errorf("code exchange failed: %s", err.Error())
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed getting user info: %s", err.Error())
	}

	defer response.Body.Close()
	contents, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("failed reading response body: %s", err.Error())
	}

	return contents, nil
}
