import '@testing-library/react';
import { ReactElement } from 'react';

declare module '@testing-library/react' {
  // Override the render method to accept JSX.Element
  export function render(
    ui: JSX.Element,
    options?: any
  ): ReturnType<typeof render>;
}
