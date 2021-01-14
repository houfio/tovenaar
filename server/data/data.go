package data

import (
	"context"
	"net/http"
	"time"
	"tovenaar/db"
	"tovenaar/utils"
)

//go:generate go run github.com/vektah/dataloaden AnswersLoader string []tovenaar/db.AnswerModel
//go:generate go run github.com/vektah/dataloaden QuestionLoader string *tovenaar/db.QuestionModel
//go:generate go run github.com/vektah/dataloaden CollectionLoader string *tovenaar/db.AnswerCollectionModel

type Loaders struct {
	AnswersByCollectionId AnswersLoader
	QuestionById          QuestionLoader
	CollectionById        CollectionLoader
}

func Middleware(client *db.PrismaClient) func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), "data", &Loaders{
				AnswersByCollectionId: AnswersLoader{
					wait: 1 * time.Millisecond,
					fetch: func(keys []string) ([][]db.AnswerModel, []error) {
						answers, err := client.Answer.FindMany(
							db.Answer.CollectionID.In(keys),
						).Exec(r.Context())
						if err != nil {
							panic(err)
						}

						result := make([][]db.AnswerModel, len(keys))
						for _, answer := range answers {
							index := utils.IndexOf(keys, answer.CollectionID)
							result[index] = append(result[index], answer)
						}

						return result, nil
					},
				},
				QuestionById: QuestionLoader{
					wait: 1 * time.Millisecond,
					fetch: func(keys []string) ([]*db.QuestionModel, []error) {
						questions, err := client.Question.FindMany(
							db.Question.ID.In(keys),
						).Exec(r.Context())
						if err != nil {
							panic(err)
						}

						result := make([]*db.QuestionModel, len(keys))
						for i := range questions {
							question := questions[i]
							index := utils.IndexOf(keys, question.ID)
							result[index] = &question
						}

						return result, nil
					},
				},
				CollectionById: CollectionLoader{
					wait: 1 * time.Millisecond,
					fetch: func(keys []string) ([]*db.AnswerCollectionModel, []error) {
						collections, err := client.AnswerCollection.FindMany(
							db.AnswerCollection.ID.In(keys),
						).Exec(r.Context())
						if err != nil {
							panic(err)
						}

						result := make([]*db.AnswerCollectionModel, len(keys))
						for i := range collections {
							collection := collections[i]
							index := utils.IndexOf(keys, collection.ID)
							result[index] = &collection
						}

						return result, nil
					},
				},
			})
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func For(ctx context.Context) *Loaders {
	return ctx.Value("data").(*Loaders)
}
