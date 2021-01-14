import { css } from '@emotion/react';

import { ColorPalette } from '../types';

export function withPalette(palette?: ColorPalette) {
  return palette && css`
    color: var(--${palette[0]});
    background-color: var(--${palette[1]});
  `;
}
