package repository

import (
	"gorm.io/gorm"
)

type UserDB struct {
	gorm.Model
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

func (u *UserDB) CreateUser() error {
	getDB().Create(u)
	return nil
}

func (u *UserDB) FindUserByName() error {
	getDB().First(u, "name = ?", u.Name)
	return nil
}
