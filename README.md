# prismjs-components-loader

[![NPM version](https://badge.fury.io/js/prismjs-components-loader.svg)](http://badge.fury.io/js/prismjs-components-loader)

Exposes PrismJS components (language definitions) as functions taking a Prism instance as argument.

This package will be helpful if:

- You want to control when components are injected in Prism (loaded). Loading all 120 existing components can take up to 2 seconds of JS execution time in a browser. With this package, you can defer the loading of the language definitions.
- You do not want components to inject themselves in a global Prism instance, but in a particular Prism instance

## Install

```
yarn add prismjs-components-loader
```

## Usage

You can use the `load` function to dynamically load a component and its dependencies:

```js
import Prism from 'prismjs';
import PrismLoader from 'prismjs-components-loader';
import allComponents from 'prismjs-components-loader/dist/all-components';

const prismLoader = new PrismLoader(allComponents);

// Inject components and their dependencies
prismLoader.load(Prism, 'jsx');
prismLoader.load(Prism, 'yaml');

// JSX and Yaml were injected
assert(Boolean(Prism.languages.jsx));
assert(Boolean(Prism.languages.yaml));

// ... use Prism normally
```

Alternatively, you can just require the individual components files. This is useful if you are using a bundler like `browserify` and you don't want every components to be bundled. The example below should only include the source for `prism-jsx`:

```js
import Prism from 'prismjs';
import prismJsx from 'prismjs-components-loader/dist/components/prism-jsx';

// Inject JSX component manually
prismJsx(Prism);

// ... use Prism normally
```

## API Reference

### Constructor

##### `PrismLoader(componentsIndex)`

Create a new instance of a PrismLoader. You must provide it an index of component sources, which is an object `{ [componentId: string]: componentExport }`. `all-components` is provided for you and contains all existing components. You can alternatively use `common-components` which contains the most common ones (subjectively). Or you can provide your own.

### Instance methods

##### `prismLoader.load(prism: Prism, componentId: string): void`

Inject a component and its dependencies in the given Prism instance. Does not load already loaded components. Reload all existing components that have the new component as peer dependency.
