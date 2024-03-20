package auth

import (
	"dvloper/paris-backend/config"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenResponse struct {
	Token string `json:"token"`
}

type UserClaims struct {
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	jwt.RegisteredClaims
}

func secretKey() string {
	return config.Get().JWTSecret
}

func CreateToken(u User) (string, error) {
	// Create the Claims
	claims := UserClaims{
		Email:   u.Email,
		Name:    u.Name,
		Picture: u.Picture,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "Atlantis",
			Subject:   "",
			ID:        "",
			Audience:  []string{},
		},
	}

	fmt.Println("Signing with secret key: ", secretKey())

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secretKey()))
}

func VerifyToken(token string) (*UserClaims, error) {
	claims := &UserClaims{}

	t, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey()), nil
	})
	if err != nil {
		return nil, err
	}
	if !t.Valid {
		return nil, err
	}

	return claims, nil
}
