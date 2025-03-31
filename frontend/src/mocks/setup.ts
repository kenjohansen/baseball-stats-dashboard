// Mock the TransformStream that MSW needs
if (typeof global.TransformStream === 'undefined') {
  // @ts-ignore - We're intentionally creating a minimal mock
  global.TransformStream = class TransformStream {
    readable = {
      locked: false,
      cancel: () => Promise.resolve(),
      getReader: () => ({}),
      pipeThrough: () => ({}),
      pipeTo: () => Promise.resolve(),
      tee: () => [{}]
    };
    writable = {
      abort: () => Promise.resolve(),
      close: () => Promise.resolve(),
      getWriter: () => ({})
    };
    constructor() {}
  };
}

// Mock other required objects for MSW
if (typeof global.TextEncoderStream === 'undefined') {
  // @ts-ignore - We're intentionally creating a minimal mock
  global.TextEncoderStream = class TextEncoderStream {
    readable = {
      locked: false,
      cancel: () => Promise.resolve(),
      getReader: () => ({}),
      pipeThrough: () => ({}),
      pipeTo: () => Promise.resolve(),
      tee: () => [{}]
    };
    writable = {
      abort: () => Promise.resolve(),
      close: () => Promise.resolve(),
      getWriter: () => ({})
    };
    encoding = 'utf-8';
    constructor() {}
  };
}

if (typeof global.TextDecoderStream === 'undefined') {
  // @ts-ignore - We're intentionally creating a minimal mock
  global.TextDecoderStream = class TextDecoderStream {
    readable = {
      locked: false,
      cancel: () => Promise.resolve(),
      getReader: () => ({}),
      pipeThrough: () => ({}),
      pipeTo: () => Promise.resolve(),
      tee: () => [{}]
    };
    writable = {
      abort: () => Promise.resolve(),
      close: () => Promise.resolve(),
      getWriter: () => ({})
    };
    encoding = 'utf-8';
    fatal = false;
    ignoreBOM = false;
    constructor() {}
  };
}
