import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './src/App.jsx';

try {
  // Mock localStorage and window if needed
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  };
  global.window = {
    innerWidth: 1024,
    addEventListener: () => {},
    removeEventListener: () => {}
  };

  const html = ReactDOMServer.renderToString(React.createElement(App));
  console.log("RENDER_SUCCESS, html length:", html.length);
} catch (err) {
  console.error("RENDER_ERROR:", err);
}
