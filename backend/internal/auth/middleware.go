package auth

import (
	"context"
	"dvloper/paris-backend/config"

	"net/http"
)

type AuthContextKey string

/*
Ensures that the request has a valid token inside the Authorization header
*/
func CheckAuthenticated(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get token from Cookies
		SetCorsHeaders(w)
		cookie, err := r.Cookie("session_token")
		if cookie == nil || err != nil {
			http.Error(w, "unauthorized: Not logged in", http.StatusUnauthorized)
			return
		}

		token := cookie.Value

		// Verify token
		claims, err := VerifyToken(token)
		if err != nil {
			http.Error(w, "unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		user := User{
			Email:   claims.Email,
			Name:    claims.Name,
			ID:      claims.ID,
			Picture: claims.Picture,
		}

		// If authorized, set the user in the context
		ctx := context.WithValue(r.Context(), AuthContextKey("user"), user)

		r = r.WithContext(ctx)

		next(w, r)
	}
}

func Logout(w http.ResponseWriter, r *http.Request) {
	SetCorsHeaders(w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	old_cookie, err := r.Cookie("session_token")
	if old_cookie == nil || err != nil {
		http.Error(w, "unauthorized: No cookie found", http.StatusUnauthorized)
		return
	}

	// Create a cookie to delete session_token
	cookie := &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)
	w.WriteHeader(http.StatusOK)
}

func SetCorsHeaders(w http.ResponseWriter) {
	envconfig := config.Get()
	w.Header().Set("Access-Control-Allow-Origin", envconfig.ClientURL)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
