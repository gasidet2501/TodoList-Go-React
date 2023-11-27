package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)
  
var dsn = "root:12345678@tcp(127.0.0.1)/go-todolist?charset=utf8mb4&parseTime=True&loc=Local"
var DBConnect, DBerr = gorm.Open(mysql.Open(dsn), &gorm.Config{})
