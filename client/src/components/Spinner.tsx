import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentPropsWithoutRef } from 'react';

export function Spinner(props: ComponentPropsWithoutRef<'div'>) {
  return (
    <StyledSpinner {...props}/>
  );
}

const spin = keyframes`
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
`;

const StyledSpinner = styled.div`
  position: relative;
  margin: .25rem;
  width: 1.25rem;
  height: 1.25rem;
  border: 4px solid var(--gray-500);
  border-radius: 50%;
  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 1.75rem;
    height: 1.75rem;
    top: -8px;
    left: -8px;
    border: 4px solid transparent;
    border-left-color: var(--blue-200);
    border-radius: 50%;
    animation: ${spin} .5s infinite linear;
  }
`;
