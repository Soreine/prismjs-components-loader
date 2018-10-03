# Contributing

The library is architectured as follow:

# Build script

## Components

A build script will generate all language components definitions in the `src/components` folder, **exposed as a callable function**. This is the same definitions that you can find in `prismjs/components/` except that they are wrapped inside a function to control when we want them to be injected, and where.

## Components index

The library offers two list of components already required for you: `all-components` and `common-components`. They are just a convenient way of requiring some or all components in `dist/components`.

## Compiling everything in `dist/`

Once everything has been generated, it is compiled using Babel into `dist/`.