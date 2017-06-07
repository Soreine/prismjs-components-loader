var allComponents = require('./all-components');
var componentDefinitions = require('./componentDefinitions');

/**
 * Load a component and its dependencies into the given Prism instance
 * @param  {Prism}  Prism       The prism instance
 * @param  {String} componentId The component id
 * @return {Void}
 */
function load(Prism, componentId) {
    var definition =  componentDefinitions.MAP[componentId];
    if (!definition) {
        throw new Error('Unknown Prism component: ' + componentId);
    }

    // Load dependencies
    var dependencies = componentDefinitions.getDependencies(definition, Prism);
    dependencies.forEach(function (dep) {
        load(Prism, dep);
    })

    // Inject the component
    var component = allComponents[componentId];
    component(Prism);
}

module.exports = componentDefinitions;
module.exports.load = load;
