import { Breakpoint, Color, Shade } from './types';

export const breakpoints: Record<Breakpoint, number> = {
  phone: 0,
  tabletPortrait: 37.5,
  tabletLandscape: 56.25,
  laptop: 75,
  desktop: 93.75
};

export const colors: Record<Color, Partial<Record<Shade, string | [string, string]>>> = {
  gray: {
    0: ['white', '#1f1f1f'],
    100: ['#efefef', '#303030'],
    200: ['#d4d4d4', '#404040'],
    300: ['#9a9a9a', '#5f5f5f'],
    400: ['#707070', '#929292'],
    500: ['#454545', '#efefef']
  },
  blue: {
    100: ['#e0e5ff', '#242b54'],
    200: '#4e6aff',
    300: ['#283daf', '#e0e5ff']
  }
};
