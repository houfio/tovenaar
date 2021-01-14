import styled from '@emotion/styled';
import { ComponentPropsWithoutRef } from 'react';
import { FormProvider, UseFormMethods } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';
import { SubmitHandler } from 'react-hook-form/dist/types/form';

type Props<T> = {
  form: UseFormMethods<T>,
  onSubmit: SubmitHandler<T>
};

export function Form<T extends FieldValues>({ form, onSubmit, ...props }: Props<T> & Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'>) {
  return (
    <FormProvider {...form}>
      <StyledForm onSubmit={form.handleSubmit(onSubmit)} {...props}/>
    </FormProvider>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
