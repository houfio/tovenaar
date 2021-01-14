import styled from '@emotion/styled';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { ColorPalette, ColorShade } from '../../types';
import { withPalette } from '../../utils/withPalette';
import { Spinner } from '../Spinner';

type Props = {
  as?: keyof JSX.IntrinsicElements,
  palette?: ColorPalette,
  text: string,
  loading?: boolean
};

export const Button = forwardRef<HTMLButtonElement, Props & ComponentPropsWithoutRef<'button'>>((props, ref) => (
  <StyledButton ref={ref} title={props.text} {...props} disabled={props.loading || props.disabled}>
    <StyledContent loading={props.loading ?? false}>
      {props.children || props.text}
    </StyledContent>
    {props.loading && (
      <StyledSpinner/>
    )}
  </StyledButton>
));

const StyledButton = styled('button', {
  shouldForwardProp: (p) => p !== 'as' && p !== 'loading' && p !== 'palette'
})<Props>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .75rem 1rem;
  color: white;
  background-color: var(--blue-200);
  border-radius: .5rem;
  text-align: center;
  text-decoration: none;
  outline: none;
  transition: color .25s ease, background-color .25s ease, box-shadow .25s ease, opacity .25s ease;
  &:focus {
    box-shadow: 0 0 0 3px var(--gray-500);
    z-index: 1;
  }
  &:disabled {
    pointer-events: none;
    opacity: .5;
  }
  ${(props) => withPalette(props.palette)};
`;

const StyledContent = styled('div', {
  shouldForwardProp: (p) => p !== 'as' && p !== 'loading'
})<{ loading: boolean }>`
  opacity: ${(props) => props.loading ? 0 : 1};
`;

const StyledSpinner = styled(Spinner)<{ palette?: [ColorShade, ColorShade] }>`
  position: absolute;
  border-color: var(--${(props) => props.palette?.[0]});
  &::after {
    border-left-color: var(--${(props) => props.palette?.[0]});
  }
`;
