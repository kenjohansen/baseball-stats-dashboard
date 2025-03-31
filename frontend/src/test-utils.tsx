import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

// Define a type that accepts both JSX.Element and ReactElement
type UI = Parameters<typeof rtlRender>[0];

// Custom render function with type casting to handle JSX.Element
function render(ui: any, options?: Omit<RenderOptions, 'wrapper'>) {
  // Cast the UI to the expected type to avoid TypeScript errors
  return rtlRender(ui as UI, { ...options });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
