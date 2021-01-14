package main

//go:generate go run github.com/prisma/prisma-client-go db push --preview-feature
//go:generate go run github.com/99designs/gqlgen

import (
	"context"
	"errors"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/gorilla/websocket"
	"github.com/goware/emailx"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"tovenaar/auth"
	"tovenaar/data"
	"tovenaar/db"
	"tovenaar/graph"
	"tovenaar/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

func main() {
	if err := run(); err != nil {
		panic(err)
	}
}

func run() error {
	if err := godotenv.Load(); err != nil {
		return err
	}

	router := chi.NewRouter()
	client := db.NewClient()
	config := generated.Config{Resolvers: &graph.Resolver{
		DB:             client,
		AnswerChannels: map[int]chan *db.AnswerCollectionModel{},
		Mutex:          sync.Mutex{},
	}}

	config.Directives.NotEmpty = func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {
		obj, err = next(ctx)
		if err != nil {
			return nil, err
		} else if len(obj.(string)) == 0 {
			return nil, errors.New("string must not be empty")
		}

		return obj, nil
	}

	config.Directives.Positive = func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {
		obj, err = next(ctx)
		if err != nil {
			return nil, err
		} else if obj.(int) < 0 {
			return nil, errors.New("integer must be positive")
		}

		return obj, nil
	}

	config.Directives.Email = func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {
		obj, err = next(ctx)
		if err != nil {
			return nil, err
		} else if err = emailx.Validate(obj.(string)); err != nil {
			return nil, errors.New("string must be valid e-mail address")
		}

		return obj, nil
	}

	server := handler.New(generated.NewExecutableSchema(config))
	dir, _ := os.Getwd()
	uploads := http.Dir(filepath.Join(dir, "uploads"))

	if err := client.Connect(); err != nil {
		return err
	}

	server.AddTransport(transport.Options{})
	server.AddTransport(transport.GET{})
	server.AddTransport(transport.POST{})
	server.AddTransport(transport.MultipartForm{})
	server.AddTransport(&transport.Websocket{
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	})

	server.Use(extension.Introspection{})

	router.Use(middleware.DefaultLogger)
	router.Use(auth.Middleware(client))
	router.Use(data.Middleware(client))
	router.Use(cors.AllowAll().Handler)

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", server)
	router.Get("/uploads/*", http.StripPrefix("/uploads", http.FileServer(uploads)).ServeHTTP)

	if err := http.ListenAndServe(":8080", router); err != nil {
		return err
	}

	return client.Disconnect()
}
