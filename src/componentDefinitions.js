import COMPONENTS from 'prismjs/components';

const LANGUAGES = { ...COMPONENTS.languages };
delete LANGUAGES.meta;

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
    'markup-templating',
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

// List all components for which a component is a peer dependency
const PEERS = Object.keys(LANGUAGES).reduce((acc, language) => {
    let { peerDependencies } = COMPONENTS.languages[language];
    if (peerDependencies) {
        if (!Array.isArray(peerDependencies)) {
            peerDependencies = [peerDependencies];
        }

        peerDependencies.forEach(peer => {
            if (!acc[peer]) {
                acc[peer] = [];
            }
            acc[peer].push(language);
        });
    }

    return acc;
}, {});

/**
 * @param  {String}  componentId
 * @return {Array} The list of components for which this component is a peer dependency
 */
function getPeers(componentId) {
    return PEERS[componentId] || [];
}

/**
 * @param  {String}  componentId
 * @return {Boolean} True if the component is a common one.
 */
function isCommon(componentId) {
    return COMMON.indexOf(componentId) !== -1;
}

export { LANGUAGES, isCommon, getDependencies, getPeers };
