package repository

import (
	"time"

	"gorm.io/gorm"
)

type ExecutorDB struct {
	gorm.Model
	ID      string    `json:"id"`
	ExpDate time.Time `json:"exp_date"`
	LLM     string    `json:"model"`
}

func (e *ExecutorDB) CreateExecutor() error {
	res := getDB().Create(e)
	return res.Error
}

func (e *ExecutorDB) FindExecutorById() error {
	res := getDB().First(&e, "id = ?", e.ID)
	return res.Error
}
