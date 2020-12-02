package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func notesSend(c echo.Context) error {
	if !checkForm(c, "sendTo", "content") {
		return c.JSON(http.StatusBadRequest, response{Status: "error", Error: "Missing parameters"})
	}

	if c.FormValue("sendTo") != "santa" && c.FormValue("sendTo") != "recipient" {
		return c.JSON(http.StatusBadRequest, response{Status: "error", Error: "Invalid recipient"})
	}

	userID, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user ID", err)
	}

	recipientID := -1
	toSanta := 0

	if c.FormValue("sendTo") == "santa" {
		toSanta = 1
		err := db.QueryRow("SELECT id FROM users WHERE assignedUser = ?", userID).Scan(&recipientID)
		if err != nil {
			return ise(c, "getting recipient", err)
		}
	} else {
		err := db.QueryRow("SELECT assignedUser FROM users WHERE id = ?", userID).Scan(&recipientID)
		if err != nil {
			return ise(c, "getting recipient", err)
		}
	}

	_, err = db.Exec("INSERT INTO notes (fromUser, toUser, toSanta, sendTime, content) VALUES (?, ?, ?, NOW(), ?)", userID, recipientID, toSanta, c.FormValue("content"))
	if err != nil {
		return ise(c, "adding note", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok"})
}

func notesGet(c echo.Context) error {
	userID, err := getUserID(c)
	if err != nil {
		return ise(c, "adding note", err)
	}

	recipientID := -1

	err = db.QueryRow("SELECT assignedUser FROM users WHERE id = ?", userID).Scan(&recipientID)
	if err != nil {
		return ise(c, "getting recipient", err)
	}

	if recipientID == -1 {
		return c.JSON(http.StatusBadRequest, response{Status: "Error", Error: "Giftee has not been assigned yet."})
	}

	santaConv := []note{}
	recipConv := []note{}

	rows, err := db.Query("SELECT fromUser, toUser, toSanta, sendTime, content FROM notes WHERE fromUser = ? OR toUser = ?", userID, userID)
	if err != nil {
		return ise(c, "getting notes", err)
	}

	defer rows.Close()

	for rows.Next() {
		fromUser := -1
		toUser := -1
		toSanta := 0
		sendTime := ""
		content := ""

		err := rows.Scan(&fromUser, &toUser, &toSanta, &sendTime, &content)
		if err != nil {
			return ise(c, "scanning row", err)
		}

		n := note{
			DateTime: sendTime,
			Content:  content,
			IsSender: fromUser == userID,
		}

		if (toSanta == 1 && fromUser == userID) || (toSanta == 0 && fromUser != userID) {
			santaConv = append(santaConv, n)
		} else {
			recipConv = append(recipConv, n)
		}
	}

	respData := notesData{
		SantaConversation:     santaConv,
		RecipientConversation: recipConv,
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: respData})
}
