/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QuestionsQuery
// ====================================================

export interface QuestionsQuery_questions {
  __typename: "Question";
  id: string;
  text: string;
  order: number;
}

export interface QuestionsQuery {
  questions: QuestionsQuery_questions[];
}
