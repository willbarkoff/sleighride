package main

import (
	"log"
	"net/http"
	"runtime"
	"strings"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

func checkForm(c echo.Context, s ...string) bool {
	for _, v := range s {
		if c.FormValue(v) == "" {
			return false
		}
	}
	return true
}

func ise(c echo.Context, context string, err error) error {
	logError(err, context)
	return c.JSON(http.StatusInternalServerError, response{Status: "error", Error: "An internal server error occured while processing the request"})
}

func validatePassword(password string) bool {
	return strings.ContainsAny(strings.ToLower(password), "abcdefghijklmnopqrstuvwxyz") && strings.ContainsAny(password, "0123456789") && len(password) >= 8
}

func validateUsername(username string) bool {
	return !strings.ContainsAny(strings.ToLower(username), " ") && len(username) <= 20
}

func logError(err error, context string) {
	buf := make([]byte, 1<<16)
	stackSize := runtime.Stack(buf, false)
	stackTrace := string(buf[0:stackSize])

	log.Println("======================================")

	log.Printf("Error occurred while '%s'!", context)
	errDesc := ""
	if err != nil {
		errDesc = err.Error()
	} else {
		errDesc = "(err == nil)"
	}
	log.Println(errDesc)
	log.Println(stackTrace)

	log.Println("======================================")
}

func getUserID(c echo.Context) (int, error) {
	sess, err := session.Get("session", c)
	if err != nil {
		return 0, err
	}
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 30, // expire after 30 days
		HttpOnly: true,
	}
	id, ok := sess.Values["userId"].(int)
	if !ok {
		return -1, nil
	}
	return id, nil
}

func getUserInfo(id int) (user, error) {
	var username, fname, lname, addr1, addr2, city, state, zip string

	err := db.QueryRow("SELECT username, fname, lname, addr1, addr2, city, state, zip FROM users WHERE id = ?", id).Scan(
		&username,
		&fname,
		&lname,
		&addr1,
		&addr2,
		&city,
		&state,
		&zip,
	)
	if err != nil {
		return user{}, err
	}

	u := user{
		ID:    id,
		First: fname,
		Last:  lname,
		Addr1: addr1,
		Addr2: addr2,
		City:  city,
		State: state,
		Zip:   zip,
	}
	return u, nil
}

func isManager(id int) bool {
	isManagerInt := 0
	db.QueryRow("SELECT isManager FROM users WHERE id = ?", id).Scan(&isManagerInt)
	return isManagerInt != 0
}

func getAssignedUser(id int) int {
	assignedUserID := -1
	db.QueryRow("SELECT assignedUser FROM users WHERE id = ?", id).Scan(&assignedUserID)
	return assignedUserID
}
