package main

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
