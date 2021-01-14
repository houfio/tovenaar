package graph

import (
	"sync"
	"tovenaar/db"
)

type Resolver struct {
	DB             *db.PrismaClient
	AnswerChannels map[int]chan *db.AnswerCollectionModel
	Mutex          sync.Mutex
}
