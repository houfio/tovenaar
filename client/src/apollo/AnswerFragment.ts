/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AnswerFragment
// ====================================================

export interface AnswerFragment_answers_question {
  __typename: "Question";
  id: string;
  text: string;
}

export interface AnswerFragment_answers {
  __typename: "Answer";
  id: string;
  asset: string;
  question: AnswerFragment_answers_question;
}

export interface AnswerFragment {
  __typename: "AnswerCollection";
  id: string;
  createdAt: any;
  email: string;
  answers: AnswerFragment_answers[];
}
