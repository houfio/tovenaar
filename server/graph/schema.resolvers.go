package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"github.com/goware/emailx"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"tovenaar/auth"
	"tovenaar/data"
	"tovenaar/db"
	"tovenaar/graph/generated"
	"tovenaar/graph/model"
	"tovenaar/utils"
)

func (r *answerResolver) Collection(ctx context.Context, obj *db.AnswerModel) (*db.AnswerCollectionModel, error) {
	return data.For(ctx).CollectionById.Load(obj.CollectionID)
}

func (r *answerResolver) Question(ctx context.Context, obj *db.AnswerModel) (*db.QuestionModel, error) {
	return data.For(ctx).QuestionById.Load(obj.QuestionID)
}

func (r *answerCollectionResolver) Answers(ctx context.Context, obj *db.AnswerCollectionModel) ([]db.AnswerModel, error) {
	return data.For(ctx).AnswersByCollectionId.Load(obj.ID)
}

func (r *mutationResolver) Login(ctx context.Context, input model.AuthenticationInput) (*model.Authentication, error) {
	var email = emailx.Normalize(input.Email)
	user, err := r.DB.User.FindOne(
		db.User.Email.Equals(email),
	).Exec(ctx)
	if err != nil {
		return nil, err
	} else if err = utils.CheckPassword(input.Password, user.Password); err != nil {
		return nil, err
	}

	token, err := utils.SignToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &model.Authentication{
		Token: token,
		User:  &user,
	}, nil
}

func (r *mutationResolver) Register(ctx context.Context, input model.AuthenticationInput) (*model.Authentication, error) {
	var email = emailx.Normalize(input.Email)
	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		return nil, err
	}

	user, err := r.DB.User.CreateOne(
		db.User.Email.Set(email),
		db.User.Password.Set(hashed),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	token, err := utils.SignToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &model.Authentication{
		Token: token,
		User:  &user,
	}, nil
}

func (r *mutationResolver) UpsertQuestion(ctx context.Context, input model.QuestionInput) (*db.QuestionModel, error) {
	user := auth.For(ctx)
	if user == nil {
		return nil, errors.New("unauthorized")
	}

	var question db.QuestionModel
	var err error
	if input.ID != nil {
		question, err = r.DB.Question.FindOne(
			db.Question.ID.Equals(*input.ID),
		).Update(
			db.Question.Text.Set(input.Text),
			db.Question.Order.Set(input.Order),
		).Exec(ctx)
	} else {
		question, err = r.DB.Question.CreateOne(
			db.Question.Text.Set(input.Text),
			db.Question.Order.Set(input.Order),
		).Exec(ctx)
	}

	if err != nil {
		return nil, err
	}

	return &question, nil
}

func (r *mutationResolver) DeleteQuestion(ctx context.Context, input model.IDInput) (*db.QuestionModel, error) {
	user := auth.For(ctx)
	if user == nil {
		return nil, errors.New("unauthorized")
	}

	_, err := r.DB.Answer.FindMany(
		db.Answer.QuestionID.Equals(input.ID),
	).Delete().Exec(ctx)
	if err != nil {
		return nil, err
	}

	question, err := r.DB.Question.FindOne(
		db.Question.ID.Equals(input.ID),
	).Delete().Exec(ctx)
	if err != nil {
		return nil, err
	}

	return &question, nil
}

func (r *mutationResolver) CreateCollection(ctx context.Context, input model.CollectionInput) (*db.AnswerCollectionModel, error) {
	var email = emailx.Normalize(input.Email)
	collection, err := r.DB.AnswerCollection.CreateOne(
		db.AnswerCollection.Email.Set(email),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	dir, _ := os.Getwd()
	targetDir := filepath.Join(dir, "uploads", collection.ID)
	err = os.Mkdir(targetDir, 0777)
	if err != nil {
		return nil, err
	}

	for _, i := range input.Answers {
		if !strings.Contains(i.File.ContentType, "image") {
			return nil, errors.New("invalid file type")
		}

		bytes, err := ioutil.ReadAll(i.File.File)
		if err != nil {
			return nil, err
		} else if err = ioutil.WriteFile(filepath.Join(targetDir, i.File.Filename), bytes, 0644); err != nil {
			return nil, err
		}

		_, err = r.DB.Answer.CreateOne(
			db.Answer.Asset.Set(i.File.Filename),
			db.Answer.Collection.Link(
				db.AnswerCollection.ID.Equals(collection.ID),
			),
			db.Answer.Question.Link(
				db.Question.ID.Equals(i.QuestionID),
			),
		).Exec(ctx)
		if err != nil {
			return nil, err
		}
	}

	if err := utils.SendMail(email, "Tovenaar support ticket", "Thanks for completing the questionnaire! Your unique ticket ID: #"+collection.ID+"."); err != nil {
		return nil, err
	}

	r.Mutex.Lock()
	for _, channel := range r.AnswerChannels {
		channel <- &collection
	}

	r.Mutex.Unlock()
	return &collection, nil
}

func (r *mutationResolver) DeleteCollection(ctx context.Context, input model.IDInput) (*db.AnswerCollectionModel, error) {
	user := auth.For(ctx)
	if user == nil {
		return nil, errors.New("unauthorized")
	}

	_, err := r.DB.Answer.FindMany(
		db.Answer.CollectionID.Equals(input.ID),
	).Delete().Exec(ctx)
	if err != nil {
		return nil, err
	}

	collection, err := r.DB.AnswerCollection.FindOne(
		db.AnswerCollection.ID.Equals(input.ID),
	).Delete().Exec(ctx)
	if err != nil {
		return nil, err
	}

	dir, _ := os.Getwd()
	_ = os.RemoveAll(filepath.Join(dir, "uploads", input.ID))
	return &collection, nil
}

func (r *queryResolver) Me(ctx context.Context) (*db.UserModel, error) {
	return auth.For(ctx), nil
}

func (r *queryResolver) Questions(ctx context.Context) ([]db.QuestionModel, error) {
	return r.DB.Question.FindMany().Exec(ctx)
}

func (r *queryResolver) Answers(ctx context.Context) ([]db.AnswerCollectionModel, error) {
	user := auth.For(ctx)
	if user == nil {
		return nil, errors.New("unauthorized")
	}

	return r.DB.AnswerCollection.FindMany().Exec(ctx)
}

var index = 0

func (r *subscriptionResolver) AnswerSubmitted(ctx context.Context) (<-chan *db.AnswerCollectionModel, error) {
	answers := make(chan *db.AnswerCollectionModel, 1)
	id := index
	index++
	r.Mutex.Lock()
	r.AnswerChannels[id] = answers
	r.Mutex.Unlock()

	go func() {
		<-ctx.Done()
		r.Mutex.Lock()
		delete(r.AnswerChannels, id)
		r.Mutex.Unlock()
	}()

	return answers, nil
}

// Answer returns generated.AnswerResolver implementation.
func (r *Resolver) Answer() generated.AnswerResolver { return &answerResolver{r} }

// AnswerCollection returns generated.AnswerCollectionResolver implementation.
func (r *Resolver) AnswerCollection() generated.AnswerCollectionResolver {
	return &answerCollectionResolver{r}
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type answerResolver struct{ *Resolver }
type answerCollectionResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
