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

You can use the `load` function to dynamically load a component and its dependencies:

```js
const Prism = require('prismjs');
const PrismLoader = require('prismjs-components-loader');

// Inject components and their dependencies
PrismLoader.load(Prism, 'jsx');
PrismLoader.load(Prism, 'yaml');

// JSX and Yaml were injected
assert(Boolean(Prism.languages.jsx));
assert(Boolean(Prism.languages.yaml));

// ... use Prism normally
```

Alternatively, you can just require the individual components files. This is useful if you are using a bundler like `browserify` and you don't want every components to be bundled. The example below should only include the source for `prism-jsx`:

```js
const Prism = require('prismjs');
const prismJsx = require('prismjs-components-loader/components/prism-jsx');

// Inject JSX component manually
prismJsx(Prism);

// ... use Prism normally
```

## API Reference

### `PrismLoader.load(prism: Prism, componentId: string): void`

Inject a component and its dependencies in the given Prism instance. Does not load already loaded components.

### `PrismLoader.LIST: Array<string>`

The list of all component IDs.

### `PrismLoader.MAP: Object<string, ComponentDefinition>`

A map between component IDs and their metadata.

```js
type ComponentDefinition = {
    title: string, // Human readable name of the component
    require: Array<string> // The list of component IDs this component depends on
}
```

### `PrismLoader.getDependencies(component: ComponentDefinition, prism: ?Prism): Array<string>`

Returns a component's list of dependencies. If passed a Prism instance, filters out already loaded dependencies.
