import { css } from '@emotion/react';

import { colors } from '../constants';

export function generateColors() {
  let light: string[] = [];
  let dark: string[] = [];

  for (const [color, v] of Object.entries(colors)) {
    for (const [shade, vv] of Object.entries(v)) {
      const [l, d] = Array.isArray(vv) ? vv : [vv, vv];

      light = [...light, `--${color}-${shade}: ${l}`];
      dark = [...dark, `--${color}-${shade}: ${d}`];
    }
  }

  return css`
    ${light.join(';')};
    @media (prefers-color-scheme: dark) {
      ${dark.join(';')}
    }
  `;
}
