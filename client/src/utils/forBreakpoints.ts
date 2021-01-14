import { css, SerializedStyles } from '@emotion/react';

import { Breakpoint, Breakpoints } from '../types';

import { forBreakpoint } from './forBreakpoint';

export function forBreakpoints<T>(
  breakpoints: Breakpoints<T>,
  getStyle: (value: T, breakpoint: Breakpoint) => SerializedStyles
) {
  let result: SerializedStyles | undefined;

  for (const key in breakpoints) {
    if (!breakpoints.hasOwnProperty(key)) {
      continue;
    }

    const breakpoint = key as Breakpoint;
    const value = breakpoints[breakpoint];

    if (value !== undefined) {
      result = css`
        ${result};
        ${forBreakpoint(breakpoint, getStyle(value, breakpoint))};
      `;
    }
  }

  return result;
}
