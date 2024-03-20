package repository

import (
	"database/sql"
	"dvloper/paris-backend/config"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var database *gorm.DB = nil

func initDB() {
	envconfig := config.Get()
	dsn := fmt.Sprintf("host=%s user=%s password=%s port=%s",
		envconfig.DB_URL,
		envconfig.DB_USER,
		envconfig.DB_PASSWORD,
		envconfig.DB_PORT,
	)

	fmt.Println(dsn)

	sqlDB, err := sql.Open("pgx", dsn)
	if err != nil {
		panic("failed to create dsn")
	}
	database, err = gorm.Open(postgres.New(postgres.Config{Conn: sqlDB}), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schemas
	database.AutoMigrate(UserDB{})
	database.AutoMigrate(ExecutorDB{})

}

func getDB() *gorm.DB {
	if database == nil {
		initDB()
	}

	return database
}
