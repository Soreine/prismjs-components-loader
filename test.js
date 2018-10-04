/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import test from 'ava';
import Prism from 'prismjs';
import PrismLoader from './dist/';
import commonComponents from './dist/common-components';
import allComponents from './dist/all-components';

function clearPrism(languages = Object.keys(allComponents)) {
    // Clear loaded languages
    languages.forEach(lang => {
        delete Prism.languages[lang];
    });
}

test('should expose the right things', t => {
    t.plan(2);
    // A constructor
    const instance = new PrismLoader([]);
    t.truthy(instance);
    t.truthy(instance.load);
});

test('should expose individual components in a closure', t => {
    const ids = Object.keys(allComponents);
    t.plan(ids.length);

    ids.forEach(id => {
        t.true(
            typeof require(`./dist/components/prism-${id}`).default ===
                'function'
        );
    });
});

test('Can inject a component in a Prism instance', t => {
    t.plan(2);
    const prismJsx = require('./dist/components/prism-jsx').default;
    prismJsx(Prism);

    t.truthy(Prism.languages.javascript);
    t.truthy(Prism.languages.jsx);

    clearPrism();
});

test('Can load a component and its dependencies', t => {
    t.plan(6);

    t.falsy(Prism.languages.jsx);
    t.falsy(Prism.languages.javascript);
    t.falsy(Prism.languages.markup);

    // Load jsx, which depends on javascript and markup
    const loader = new PrismLoader(commonComponents);
    loader.load(Prism, 'jsx');

    t.truthy(Prism.languages.jsx);
    t.truthy(Prism.languages.javascript);
    t.truthy(Prism.languages.markup);

    clearPrism();
});

test('Do not load already loaded components', t => {
    t.plan(3);

    // Fake that it's already loaded
    const mockPrism = {
        languages: {
            jsx: {}
        }
    };

    const loader = new PrismLoader(commonComponents);
    loader.load(mockPrism, 'jsx');

    t.deepEqual(mockPrism.languages.jsx, {});
    t.falsy(mockPrism.languages.markup);
    t.falsy(mockPrism.languages.javascript);
});

test('should fail to load non-provided component', t => {
    t.plan(1);

    const loader = new PrismLoader(commonComponents);
    t.throws(() => {
        loader.load(Prism, 'unknown');
    });
});

test('Reloads peers when needed', t => {
    t.plan(5);

    clearPrism();

    const loader = new PrismLoader(allComponents);
    loader.load(Prism, 'pug');
    t.truthy(Prism.languages.pug);

    const beforePug = Prism.languages.pug;

    // Load stylus which is a peer of Pug
    loader.load(Prism, 'stylus');
    t.truthy(Prism.languages.stylus);

    const afterPug = Prism.languages.pug;

    t.truthy(Prism.languages.pug);
    t.truthy(Prism.languages.stylus);
    t.not(beforePug, afterPug);

    clearPrism();
});

// This test is done last, because it loads everything.
test('Can load all components in a Prism instance', t => {
    const all = Object.keys(allComponents);
    const commons = Object.keys(commonComponents);
    t.plan(all.length + commons.length);

    // Load all commons first
    const commonLoader = new PrismLoader(commonComponents);
    commons.forEach(id => {
        commonLoader.load(Prism, id);
        t.truthy(Prism.languages[id]);
    });

    clearPrism();

    // Load everything
    const allLoader = new PrismLoader(allComponents);
    all.forEach(id => {
        allLoader.load(Prism, id);
        t.truthy(Prism.languages[id]);
    });

    clearPrism();
});
