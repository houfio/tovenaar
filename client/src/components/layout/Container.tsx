import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentPropsWithoutRef } from 'react';

import { breakpoints } from '../../constants';
import { Breakpoints, ColorShade } from '../../types';
import { forBreakpoints } from '../../utils/forBreakpoints';

type Props<T> = {
  as?: T,
  edges?: Breakpoints<ColorShade | [ColorShade, ColorShade]>,
  constrain?: boolean
};

export function Container<T extends keyof JSX.IntrinsicElements = 'div'>(props: Props<T> & ComponentPropsWithoutRef<T>) {
  return (
    <StyledContainer {...props as any}/>
  );
}

const StyledContainer = styled('div', {
  shouldForwardProp: (p) => p !== 'as' && p !== 'edges' && p !== 'constrain'
})<Props<unknown>>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  ${(props) => props.edges && css`
    position: relative;
    &::before, &::after {
      content: "";
      position: absolute;
      display: block;
      top: 0;
      width: calc((100vw - 100%) / 2 + ${props.constrain ? 1 : 0}rem + 1px);
      height: 100%;
      z-index: -1;
    }
    ${forBreakpoints(props.edges, (value) => {
      const [before, after] = typeof value === 'string' ? [value, value] : value;

      return css`
        &::before {
          left: calc((100vw - 100%) / -2);
          background-color: var(--${before});
        }
        &::after {
          right: calc((100vw - 100%) / -2);
          background-color: var(--${after});
        }
      `;
    })};
  `};
  ${(props) => props.constrain !== false && forBreakpoints(breakpoints, (value) => css`
    width: calc(${value ? `${value - 1}rem` : '100%'} - 1rem);
  `)};
`;
