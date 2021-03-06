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
        const isLoaded = id => Boolean(Prism.languages[id]);

        if (isLoaded(componentId) && !forceReload) {
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

        // Peer dependencies of a component X are
        // components that are enriched after component X is loaded.
        //
        // For example, `markup` is a peerDependency of `CSS`.
        // Loading only `markup` works,
        // but if you have already loaded `CSS` when you load `markup`,
        // then `markup` will highlights CSS inside <style> tags.
        // see https://github.com/PrismJS/prism/issues/1490

        // Reload all components that benefit of the new loaded component
        getPeers(componentId)
            .filter(isLoaded)
            .forEach(peer => this.load(Prism, peer, true));
    }
}

export default PrismLoader;
