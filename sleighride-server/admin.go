package main

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

func adminUsers(c echo.Context) error {
	users := []user{}

	rows, err := db.Query("SELECT id, username, fname, lname, addr1, addr2, city, state, zip FROM users")
	if err != nil {
		return ise(c, "Getting users", err)
	}

	defer rows.Close()

	for rows.Next() {
		var id int
		var username, fname, lname, addr1, addr2, city, state, zip string

		err := rows.Scan(
			&id,
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
			return ise(c, "Scanning users", err)
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

		users = append(users, u)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: users})
}

func adminShuffle(c echo.Context) error {
	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}

	if !isManager(id) {
		return c.JSON(http.StatusUnauthorized, response{Status: "error", Error: "Unauthorized"})
	}

	tx, err := db.Begin()
	if err != nil {
		return ise(c, "creating transaction", err)
	}

	numUsers := 0
	err = tx.QueryRow("SELECT COUNT(*) from USERS").Scan(&numUsers)

	if err != nil {
		return ise(c, "getting number of users", err)
	}

	if numUsers < 2 {
		return c.JSON(http.StatusBadRequest, response{Status: "Error", Error: "Impossible to generate pairings due to few users."})
	}

	a := createRange(1, numUsers)

	for somebodyHasThemself(a) {
		shuffleArray(a)
	}

	for i, v := range a {
		_, err = tx.Exec("UPDATE users SET assignedUser = ? WHERE id = ?", v, i+1)
		if err != nil {
			tx.Rollback()
			return ise(c, "updating user", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return ise(c, "committing changes", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok"})
}

func shuffleArray(a []int) {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(a), func(i, j int) { a[i], a[j] = a[j], a[i] })
}

func createRange(start, end int) []int {
	a := []int{}
	for i := start; i <= end; i++ {
		a = append(a, i)
	}
	return a
}

func somebodyHasThemself(a []int) bool {
	for i, v := range a {
		if i+1 == v {
			return true
		}
	}
	return false
}
