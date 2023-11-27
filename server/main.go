package main

import (
	"fmt"
	"log"
	"todo/database"

	"github.com/gofiber/fiber/v2"
)

type todo struct{
	// ID int `json:"id"`
	Title string `json:"title"`
	Done bool `json:"done"`
	Body string `json:"body"`
}

type Todo struct {
	ID uint `gorm:"primaryKey;autoIncrement:index()"`
	Title string 
	Done bool 
	Body string 
}

func main() {

	app := fiber.New()

	if database.DBerr != nil{
		panic(database.DBerr.Error())
	}
	fmt.Print("Database Connect")

	// AutoMigrate จะสร้างตารางในฐานข้อมูล
	database.DBConnect.AutoMigrate(&Todo{})

	
	app.Post("/api/insert", func(c *fiber.Ctx) error {

		var todolist todo

		if err := c.BodyParser(&todolist); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON format"})
		}

		// Insert ข้อมูลในฐานข้อมูล
		database.DBConnect.Create(&todolist)

		return c.Status(200).JSON(fiber.Map{"message": "Data inserted successfully"})
	})

	log.Fatal(app.Listen(":8000"))
	
}