package main

import (
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

func authRegister(c echo.Context) error {
	if !checkForm(c, "username", "fname", "lname", "password", "secretCode", "addr1", "city", "state", "zip") {
		return c.JSON(http.StatusBadRequest, response{Status: "error", Error: "Required parameters were missing from the request"})
	}

	if strings.ToLower(c.FormValue("secretCode")) != os.Getenv("SECRET_CODE") {
		return c.JSON(http.StatusUnauthorized, response{Status: "error", Error: "Incorrect secret code"})
	}

	if len(c.FormValue("state")) != 2 {
		return c.JSON(http.StatusBadRequest, response{Status: "error", Error: "Invalid state selected"})
	}

	if len(c.FormValue("zip")) != 5 {
		return c.JSON(http.StatusBadRequest, response{Status: "error", Error: "Invalid ZIP code"})
	}

	if !validatePassword(c.FormValue("password")) {
		return c.JSON(http.StatusBadRequest, response{Status: "error", Error: "Insecure password"})
	}

	if !validateUsername(c.FormValue("username")) {
		return c.JSON(http.StatusBadRequest, response{Status: "error", Error: "Invalid username"})
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(c.FormValue("password")), bcrypt.DefaultCost)
	if err != nil {
		return ise(c, "generating hash", err)
	}

	tx, err := db.Begin()
	if err != nil {
		return ise(c, "beginning transaction", err)
	}

	userCount := 0
	isManager := 0

	err = tx.QueryRow("SELECT COUNT(*) FROM users").Scan(&userCount)
	if err != nil {
		tx.Rollback()
		return ise(c, "getting number of users", err)
	}

	if userCount == 0 {
		// that means that this is our first user! They should be the manager.
		isManager = 1
	}

	foundUserID := 0

	foundUserErr := tx.QueryRow("SELECT id FROM users WHERE username = ?", strings.ToLower(c.FormValue("username"))).Scan(&foundUserID)
	if foundUserErr == nil {
		tx.Rollback()
		return c.JSON(http.StatusConflict, response{Status: "error", Error: "A user with that username already exists"})
	}

	if userCount == 0 {
		// that means that this is our first user! They should be the manager.
		isManager = 1
	}

	_, err = tx.Exec("INSERT INTO users (username, fname, lname, password, addr1, addr2, city, state, zip, isManager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		strings.ToLower(c.FormValue("username")),
		c.FormValue("fname"),
		c.FormValue("lname"),
		hash,
		c.FormValue("addr1"),
		c.FormValue("addr2"),
		c.FormValue("city"),
		c.FormValue("state"),
		c.FormValue("zip"),
		isManager,
	)

	if err != nil {
		tx.Rollback()
		return ise(c, "adding new user", err)
	}

	userID := 0
	err = tx.QueryRow("SELECT id FROM users WHERE username = ?", c.FormValue("username")).Scan(&userID)
	if err != nil {
		tx.Rollback()
		return ise(c, "getting user ID", err)
	}

	sess, err := session.Get("session", c)
	if err != nil {
		return ise(c, "committing new user", err)
	}

	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 30, // expire after 30 days
		HttpOnly: true,
	}
	sess.Values["userId"] = userID
	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		return ise(c, "committing new user", err)
	}

	err = tx.Commit()
	if err != nil {
		return ise(c, "committing new user", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok"})
}

func authLogin(c echo.Context) error {
	if !checkForm(c, "username", "password") {
		return c.JSON(http.StatusBadRequest, response{Status: "error", Error: "Required parameters were missing from the request"})
	}

	var hashedPassword string
	id := 0

	userNotFound := db.QueryRow("SELECT id, password FROM users WHERE username = ?", strings.ToLower(c.FormValue("username"))).Scan(&id, &hashedPassword)
	if userNotFound != nil {
		return c.JSON(http.StatusUnauthorized, response{Status: "error", Error: "User not found"})
	}

	incorrectPassword := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(c.FormValue("password")))
	if incorrectPassword != nil {
		return c.JSON(http.StatusUnauthorized, response{Status: "error", Error: "Incorrect password"})
	}

	sess, err := session.Get("session", c)
	if err != nil {
		return ise(c, "Getting context", err)
	}
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 30, // expire after 30 days
		HttpOnly: true,
	}
	sess.Values["userId"] = id
	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		return ise(c, "Saving session", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok"})
}

func authLogout(c echo.Context) error {
	sess, err := session.Get("session", c)
	if err != nil {
		return ise(c, "Getting context", err)
	}
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 30, // expire after 30 days
		HttpOnly: true,
	}
	sess.Values["userId"] = -1
	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		return ise(c, "Saving session", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok"})
}

func authWhoamI(c echo.Context) error {
	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user ID", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: id})
}

func authMe(c echo.Context) error {
	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user ID", err)
	}

	if id == -1 {
		return c.JSON(http.StatusUnauthorized, response{Status: "error", Error: "Unauthorized"})
	}

	u, err := getUserInfo(id)
	if err != nil {
		return ise(c, "getting user info", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: u})
}
