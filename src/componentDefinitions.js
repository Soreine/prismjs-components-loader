import COMPONENTS from 'prismjs/components';

const LANGUAGES = { ...COMPONENTS.languages };
delete LANGUAGES.meta;

// Peer dependencies of a language are
// components that are enriched after another component is loaded.
//
// For example, `markup` is a peerDependency of `CSS`.
// Loading only `markup` works,
// but if you have already loaded `CSS` when you load `markup`,
// then `markup` will highlights CSS inside <style> tags.
// see https://github.com/PrismJS/prism/issues/1490
//
// We treat peer dependencies as optional.

// Mainstream and commonly used components.
// According to some arbitrary beliefs.
const COMMON = [
    'aspnet',
    'bash',
    'c',
    'clike',
    'coffeescript',
    'cpp',
    'csharp',
    'css',
    'd',
    'dart',
    'diff',
    'elixir',
    'erlang',
    'fsharp',
    'go',
    'graphql',
    'groovy',
    'haskell',
    'http',
    'java',
    'javascript',
    'jsx',
    'julia',
    'kotlin',
    'lua',
    'markup',
    'objectivec',
    'ocaml',
    'perl',
    'php',
    'python',
    'r',
    'ruby',
    'rust',
    'scala',
    'scheme',
    'sql',
    'swift',
    'typescript',
    'yaml'
];

/**
 * List the dependencies for a component. If Prism is provided, only returns
 * dependencies that are not present in `Prism.languages`
 * @param {Object} component Component definition
 * @param {Prism} Prism instance
 * @return {Array<String>}
 */
function getDependencies(component, Prism) {
    // Cast require to an Array
    const deps = [].concat(component.require || []);

    if (Prism) {
        return deps.filter(
            dep =>
                // Remove dependencies that are already loaded
                !Prism.languages[dep]
        );
    }
    return deps;
}

/**
 * @param  {String}  componentId
 * @return {Boolean} True if the component is a common one.
 */
function isCommon(componentId) {
    return COMMON.indexOf(componentId) !== -1;
}

export { LANGUAGES, isCommon, getDependencies };
