package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

type Todo struct{
	ID int `json:"id"`
	Title string `json:"title"`
	Done bool `json:"done"`
	Body string `json:"body"`
}

func main() {
	fmt.Print("hello")

	app := fiber.New()

	if database.err != nil{
		panic(database.err.Error())
	}
	fmt.Print("Database Connect")

	app.Get("/:n", func(c *fiber.Ctx) error {
		n := c.Params("n")
		return c.SendString(n)
	})

	log.Fatal(app.Listen(":8000"))
	
}