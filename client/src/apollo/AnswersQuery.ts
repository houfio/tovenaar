/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AnswersQuery
// ====================================================

export interface AnswersQuery_answers_answers_question {
  __typename: "Question";
  id: string;
  text: string;
}

export interface AnswersQuery_answers_answers {
  __typename: "Answer";
  id: string;
  asset: string;
  question: AnswersQuery_answers_answers_question;
}

export interface AnswersQuery_answers {
  __typename: "AnswerCollection";
  id: string;
  createdAt: any;
  email: string;
  answers: AnswersQuery_answers_answers[];
}

export interface AnswersQuery {
  answers: AnswersQuery_answers[];
}
