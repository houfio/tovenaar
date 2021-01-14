import { css, SerializedStyles } from '@emotion/react';

import { breakpoints } from '../constants';
import { Breakpoint } from '../types';

export function forBreakpoint(breakpoint: Breakpoint, style: SerializedStyles) {
  if (breakpoint === 'phone') {
    return style;
  }

  return css`
    @media (min-width: ${breakpoints[breakpoint]}rem) {
      ${style};
    }
  `;
}
