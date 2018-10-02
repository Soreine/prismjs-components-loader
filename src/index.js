import { getDependencies, getPeers, LANGUAGES } from './componentDefinitions';

class PrismLoader {
    constructor(componentsIndex) {
        this.componentsIndex = componentsIndex || {};
    }

    /**
     * Load a component and its dependencies into the given Prism instance.
     * Does not load already loaded components
     * @param  {Prism}  Prism       The prism instance
     * @param  {String} componentId The component id
     * @param  {Boolean} forceReload      Should force the reloading of the component
     * @return {Void}
     */
    load(Prism, componentId, forceReload = false) {
        if (Prism.languages[componentId] && !forceReload) {
            // Already loaded
            return;
        }

        const definition = LANGUAGES[componentId];
        if (!definition) {
            throw new Error(`Unknown Prism component: ${componentId}`);
        }

        // Load dependencies
        const dependencies = getDependencies(definition, Prism);
        dependencies.forEach(dep => this.load(Prism, dep));

        // Inject the component
        const component = this.componentsIndex[componentId];
        if (!component) {
            throw new Error(`Missing Prism component: ${componentId}`);
        }

        component(Prism);

        // Reload all peers
        const peers = getPeers(componentId);
        peers.forEach(peer => {
            this.load(Prism, peer, true);
        });
    }
}

export default PrismLoader;
