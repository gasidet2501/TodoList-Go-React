package main

import (
	"encoding/json"
	"fmt"
	"log"
	"todo/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type todo struct{
	ID int `json:"id"`
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
	app.Use(cors.New())
	// Middleware สำหรับ CORS
	// app.Use(func(c *fiber.Ctx) error {
	// 	c.Set("Access-Control-Allow-Origin", "http://localhost:5173") // Domain React Frontend
	// 	c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	// 	c.Set("Access-Control-Allow-Headers", "Content-Type")
	// 	return c.Next()
	// })

	if database.DBerr != nil{
		panic(database.DBerr.Error())
	}
	db := database.DBConnect
	fmt.Print("Database Connect")

	// AutoMigrate จะสร้างตารางในฐานข้อมูล
	database.DBConnect.AutoMigrate(&Todo{})

	// Get all todo
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		var todos []todo
		db.Find(&todos)

		jsonList, err := json.Marshal(todos)
        if err != nil {
            panic(err)
        }
		return c.Status(200).SendString(string(jsonList))
	})

	// Get todo by ID
	app.Get("/api/todo/:id", func(c *fiber.Ctx) error {
		var todo todo
		id := c.Params("id")
		db.First(&todo,id)

		jsonList, err := json.Marshal(todo)
        if err != nil {
            panic(err)
        }
		return c.Status(200).SendString(string(jsonList))
	})

	// Create new todo
	app.Post("/api/insert", func(c *fiber.Ctx) error {
		var todolist todo
		if err := c.BodyParser(&todolist); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON format"})
		}
		db.Create(&todolist) // Insert ข้อมูลในฐานข้อมูล
		jsonList, err := json.Marshal(todolist)
        if err != nil {
            panic(err)
        }
		return c.Status(200).SendString(string(jsonList))
	})


	// Update todo
	app.Put("/api/update/:id",func(c *fiber.Ctx) error {
		var todolist todo
		id := c.Params("id")
		db.First(&todolist,id)
		if todolist.ID == 0{
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Todo not found"})
		}
		if err := c.BodyParser(&todolist); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON format"})
		}
		db.Save(&todolist)
		jsonList, err := json.Marshal(todolist)
        if err != nil {
            panic(err)
        }
		return c.Status(200).SendString(string(jsonList))
	})

	// Update done
	app.Patch("/api/:id/done", func(c *fiber.Ctx) error {

		var todolist todo
		id := c.Params("id")
		db.First(&todolist,id)
		db.Model(&todolist).Update("done", !todolist.Done)
		db.Save(&todolist)
		jsonList, err := json.Marshal(todolist)
		if err != nil {
            panic(err)
        }
		return c.Status(200).SendString(string(jsonList))
	})

	// delete todo
	app.Delete("api/delete/:id",func(c *fiber.Ctx) error {
		id := c.Params("id")
		db.Delete(&Todo{}, id) //ใช้ struct ตรงๆได้เลยเพราะไม่ต้องนำ value ใน struct ไปใช้ต่อ
		return c.Status(200).JSON(fiber.Map{"message": "delete todo successfully"})
	})

	log.Fatal(app.Listen(":8000"))
	
}