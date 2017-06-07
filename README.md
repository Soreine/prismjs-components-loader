# prismjs-components-loader

[![NPM version](https://badge.fury.io/js/prismjs-components-loader.svg)](http://badge.fury.io/js/prismjs-components-loader)

Exposes PrismJS components (language definitions) as functions taking a Prism instance as argument.

This package will be helpful if:

- You do not want components to inject themselves in a global Prism instance
- You want to delay the loading of components. Loading all 120 existing components can take up to 2 seconds of JS execution time in a browser environment. With this package, you can lazy load the language definitions.

## Install

```
yarn add prismjs-components-loader
```

## Usage

```js
const Prism = require('prismjs');
const prismJsx = require('prismjs-components-loader/components/prism-jsx');

// Inject JSX component manually
prismJsx(Prism);

// ... use Prism normally
```
