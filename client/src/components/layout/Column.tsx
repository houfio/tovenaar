import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentPropsWithoutRef } from 'react';

import { Breakpoints } from '../../types';
import { forBreakpoints } from '../../utils/forBreakpoints';

type Props<T> = {
  as?: T,
  sizes: Breakpoints<number | [number, number]>
};

export function Column<T extends keyof JSX.IntrinsicElements = 'div'>(props: Props<T> & ComponentPropsWithoutRef<T>) {
  return (
    <StyledColumn {...props as any}/>
  );
}

const StyledColumn = styled('div', {
  shouldForwardProp: (p) => p !== 'as' && p !== 'sizes'
})<Props<unknown>>`
  position: relative;
  flex: 0 0 100%;
  flex-direction: column;
  ${(props) => forBreakpoints(props.sizes, (value) => {
    const [size, order] = typeof value === 'number' ? [value, 0] : value;
    const width = 100 / 12 * size;

    return width ? css`
      display: flex;
      flex-basis: ${width}%;
      order: ${order};
    ` : css`
      display: none;
      order: ${order};
    `;
  })};
`;
