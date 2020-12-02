package main

import (
	"database/sql"
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	db, err = sql.Open("mysql", os.Getenv("DSN"))
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	e := echo.New()

	e.Use(session.Middleware(sessions.NewCookieStore([]byte(os.Getenv("secret")))))
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{os.Getenv("cors")},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	e.POST("/auth/register", authRegister)
	e.POST("/auth/login", authLogin)
	e.POST("/auth/logout", authLogout)
	e.GET("/auth/whoami", authWhoamI)
	e.GET("/auth/me", authMe)

	e.GET("/context", context)

	e.POST("/admin/shuffle", adminShuffle)
	e.GET("/admin/users", adminUsers)

	e.GET("/data/typings", dataTypings)

	e.POST("/notes/send", notesSend)
	e.GET("/notes/get", notesGet)

	e.Logger.Fatal(e.Start(":4853"))
}
