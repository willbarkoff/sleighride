package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/wilhelmguo/golang-to-typescript/typescriptify"
)

type response struct {
	Status string      `json:"status"`
	Error  string      `json:"error,omitempty"`
	Data   interface{} `json:"data,omitempty"`
}

type user struct {
	ID    int    `json:"id"`
	First string `json:"first"`
	Last  string `json:"last"`
	Addr1 string `json:"addr1"`
	Addr2 string `json:"addr2"`
	City  string `json:"city"`
	State string `json:"state"`
	Zip   string `json:"zip"`
}

type message struct {
	ID      string `json:"id"`
	Content string `json:"content"`
}

type contextData struct {
	User         user `json:"user"`
	AssignedUser user `json:"assignedUser"`
	IsManager    bool `json:"isManager"`
}

type note struct {
	IsSender bool   `json:"isSender"`
	Content  string `json:"content"`
	DateTime string `json:"datetime"`
}

type notesData struct {
	SantaConversation     []note `json:"santaConversation"`
	RecipientConversation []note `json:"recipientConversation"`
}

func dataTypings(c echo.Context) error {
	converter := typescriptify.New()

	converter.Indent = "\t"
	converter.UseInterface = true
	converter.CreateConstructor = false
	converter.Prefix = "SleighrideAPI_"

	converter.Add(response{})
	converter.Add(user{})
	converter.Add(message{})
	converter.Add(contextData{})
	converter.Add(notesData{})
	converter.Add(note{})

	typings, err := converter.Convert(nil)

	typings = "//This only kinda works, use with caution!\n\n" + typings

	if err != nil {
		return ise(c, "generating typings", err)
	}
	return c.String(http.StatusOK, typings)
}
