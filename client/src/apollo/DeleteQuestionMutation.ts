/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IdInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteQuestionMutation
// ====================================================

export interface DeleteQuestionMutation_deleteQuestion {
  __typename: "Question";
  id: string;
}

export interface DeleteQuestionMutation {
  deleteQuestion: DeleteQuestionMutation_deleteQuestion;
}

export interface DeleteQuestionMutationVariables {
  input: IdInput;
}
