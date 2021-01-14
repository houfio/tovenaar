/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IdInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteAnswerMutation
// ====================================================

export interface DeleteAnswerMutation_deleteCollection {
  __typename: "AnswerCollection";
  id: string;
}

export interface DeleteAnswerMutation {
  deleteCollection: DeleteAnswerMutation_deleteCollection;
}

export interface DeleteAnswerMutationVariables {
  input: IdInput;
}
