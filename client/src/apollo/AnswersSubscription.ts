/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: AnswersSubscription
// ====================================================

export interface AnswersSubscription_answerSubmitted_answers_question {
  __typename: "Question";
  id: string;
  text: string;
}

export interface AnswersSubscription_answerSubmitted_answers {
  __typename: "Answer";
  id: string;
  asset: string;
  question: AnswersSubscription_answerSubmitted_answers_question;
}

export interface AnswersSubscription_answerSubmitted {
  __typename: "AnswerCollection";
  id: string;
  createdAt: any;
  email: string;
  answers: AnswersSubscription_answerSubmitted_answers[];
}

export interface AnswersSubscription {
  answerSubmitted: AnswersSubscription_answerSubmitted;
}
