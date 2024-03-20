package auth

import (
	"fmt"
	"net/http"
)

/*
Registers the routes for the auth module and sets up
proper configuration for OAuth2 providers
*/
func Init() {
	// Temporary, will be replaced with frontend
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var htmlIndex = `<html>
	<body>
		<a href="/google_login">Google Log In</a>
		<a href="/github_login">Github Log In</a>
	</body>
	</html>`
		fmt.Fprint(w, htmlIndex)
	})

	// Google OAuth2
	http.HandleFunc("/google_login", HandleGoogleLogin)
	http.HandleFunc("/google_callback", HandleGoogleCallback)
	http.HandleFunc("/check", CheckAuthenticated(CookieCheck))
	http.HandleFunc("/logout", Logout)

	// Github OAuth2
	http.HandleFunc("/github_login", HandleGithubLogin)
	http.HandleFunc("/github_callback", HandleGithubCallback)
}
