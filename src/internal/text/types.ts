import type { ReactNode } from 'react';
import type { textColorMap } from './textColorMap';

export type TextReact = {
  'data-testid'?: string;
  children: ReactNode;
  variant?: keyof typeof textColorMap;
};
