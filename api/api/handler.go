package api

import (
	"Taylor-J-Fisher-29/bible-app/pkg/server"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	server.ApiRequestHandler(w, r)
}
