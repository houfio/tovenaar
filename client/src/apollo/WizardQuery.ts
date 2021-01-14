/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: WizardQuery
// ====================================================

export interface WizardQuery_questions {
  __typename: "Question";
  id: string;
  text: string;
  order: number;
}

export interface WizardQuery {
  questions: WizardQuery_questions[];
}
