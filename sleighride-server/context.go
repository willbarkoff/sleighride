package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func context(c echo.Context) error {
	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}

	if id == -1 {
		return c.JSON(http.StatusUnauthorized, response{Status: "error", Error: "Unauthorized"})
	}

	userInfo, err := getUserInfo(id)
	if err != nil {
		return ise(c, "getting user info", err)
	}

	assignedID := getAssignedUser(id)

	assignedInfo := user{ID: -1}

	if assignedID != -1 {
		assignedInfo, err = getUserInfo(assignedID)
		if err != nil {
			return ise(c, "getting assigned user info", err)
		}
	}

	ctx := contextData{
		IsManager:    isManager(id),
		User:         userInfo,
		AssignedUser: assignedInfo,
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: ctx})
}
