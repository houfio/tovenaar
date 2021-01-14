package auth

import (
	"context"
	"errors"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"tovenaar/db"
)

func Middleware(client *db.PrismaClient) func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			var token = r.Header.Get("authorization")
			if token == "" {
				next.ServeHTTP(w, r)
				return
			}

			parsed, _ := jwt.Parse(token[7:], func(t *jwt.Token) (interface{}, error) {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, errors.New("invalid signing method")
				}

				return []byte("secret"), nil
			})
			if claims, ok := parsed.Claims.(jwt.MapClaims); ok && parsed.Valid {
				user, err := client.User.FindOne(
					db.User.ID.Equals(fmt.Sprintf("%v", claims["id"])),
				).Exec(context.Background())
				if err != nil {
					next.ServeHTTP(w, r)
					return
				}

				ctx := context.WithValue(r.Context(), "user", &user)
				r = r.WithContext(ctx)
			}

			next.ServeHTTP(w, r)
		})
	}
}

func For(ctx context.Context) *db.UserModel {
	return ctx.Value("user").(*db.UserModel)
}
