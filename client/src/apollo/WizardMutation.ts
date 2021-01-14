/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: WizardMutation
// ====================================================

export interface WizardMutation_createCollection_answers_question {
  __typename: "Question";
  text: string;
}

export interface WizardMutation_createCollection_answers {
  __typename: "Answer";
  id: string;
  question: WizardMutation_createCollection_answers_question;
  asset: string;
}

export interface WizardMutation_createCollection {
  __typename: "AnswerCollection";
  id: string;
  answers: WizardMutation_createCollection_answers[];
}

export interface WizardMutation {
  createCollection: WizardMutation_createCollection;
}

export interface WizardMutationVariables {
  input: CollectionInput;
}
