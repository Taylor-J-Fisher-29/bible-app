package search

import (
	"Taylor-J-Fisher-29/bible-app/pkg/server"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	server.SearchRequestHandler(w, r)
}
