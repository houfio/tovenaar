/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QuestionInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertQuestionMutation
// ====================================================

export interface UpsertQuestionMutation_upsertQuestion {
  __typename: "Question";
  id: string;
  text: string;
  order: number;
}

export interface UpsertQuestionMutation {
  upsertQuestion: UpsertQuestionMutation_upsertQuestion;
}

export interface UpsertQuestionMutationVariables {
  input: QuestionInput;
}
