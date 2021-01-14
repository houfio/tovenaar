import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentPropsWithoutRef } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string,
  label: string
};

export function Input(props: Props & ComponentPropsWithoutRef<'input'>) {
  const form = useFormContext();

  const { isSubmitting } = form?.formState ?? {};
  const error = form?.errors[props.name];

  return (
    <StyledWrapper type={props.type} error={Boolean(error)}>
      <StyledLabel htmlFor={props.name}>
        {props.label}
      </StyledLabel>
      <StyledInput ref={form?.register} id={props.name} readOnly={isSubmitting} {...props as any}/>
      {error && (
        <StyledError>
          {error.message}
        </StyledError>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled('div', {
  shouldForwardProp: (p) => p !== 'type' && p !== 'error'
})<{ type?: string, error: boolean }>`
  position: relative;
  margin-bottom: 1rem;
  border-radius: .5rem;
  ${(props) => props.type === 'hidden' && css`
    display: none;
  `};
  ${(props) => props.error && css`
    background-color: var(--red-200);
    box-shadow: 0 0 0 3px var(--red-200);
  `};
`;

const StyledLabel = styled.label`
  position: absolute;
  top: .75rem;
  left: 1.25rem;
  margin-right: 1.25rem;
  color: var(--gray-300);
  font-size: .75rem;
  font-weight: bold;
  text-transform: uppercase;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1.75rem 1.25rem .75rem 1.25rem;
  color: var(--gray-500);
  background-color: var(--gray-100);
  border-radius: .5rem;
  outline: none;
  resize: vertical;
  transition: box-shadow .25s ease, opacity .25s ease;
  &:focus {
    box-shadow: 0 0 0 3px var(--gray-500);
    z-index: 1;
  }
  &:disabled {
    opacity: .5;
  }
`;

const StyledError = styled.div`
  padding: .5rem 1.25rem;
  color: white;
`;
