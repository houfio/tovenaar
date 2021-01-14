/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AnswerInput {
  file: any;
  questionId: string;
}

export interface CollectionInput {
  answers: AnswerInput[];
  email: string;
}

export interface IdInput {
  id: string;
}

export interface QuestionInput {
  id?: string | null;
  order: number;
  text: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
