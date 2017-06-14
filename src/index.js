const allComponents = require('./all-components');
const componentDefinitions = require('./componentDefinitions');

/**
 * Load a component and its dependencies into the given Prism instance.
 * Does not load already loaded components
 * @param  {Prism}  Prism       The prism instance
 * @param  {String} componentId The component id
 * @return {Void}
 */
function load(Prism, componentId) {
    if (Prism.languages[componentId]) {
        // Already loaded
        return;
    }

    const definition =  componentDefinitions.MAP[componentId];
    if (!definition) {
        throw new Error('Unknown Prism component: ' + componentId);
    }

    // Load dependencies
    const dependencies = componentDefinitions.getDependencies(definition, Prism);
    dependencies.forEach(dep => load(Prism, dep));

    // Inject the component
    const component = allComponents[componentId];
    component(Prism);
}

module.exports = componentDefinitions;
module.exports.load = load;
