const test = require('ava');
const PrismLoader = require('./');

test('should expose the right things', t => {
    t.truthy(PrismLoader.LIST);
    t.truthy(PrismLoader.MAP);
    t.truthy(PrismLoader.load);
    t.truthy(PrismLoader.getDependencies);
});

test('should list all components', t => {
    t.is(PrismLoader.LIST.length, 120);
    t.is(Object.keys(PrismLoader.MAP).length, 120);
});

test('should expose individual components', t => {
    t.true(typeof require('./components/prism-jsx') === 'function');
});

test('Can inject a component in a Prism instance', t => {
    const Prism = require('prismjs');
    const prismJsx = require('./components/prism-jsx');
    prismJsx(Prism);
    t.truthy(Prism.languages.javascript);
    t.truthy(Prism.languages.jsx);
});

test('Can load a component and its dependencies', t => {
    t.plan(6);
    const Prism = require('prismjs');
    delete Prism.languages.jsx;
    delete Prism.languages.javascript;
    delete Prism.languages.markup;

    t.falsy(Prism.languages.jsx);
    t.falsy(Prism.languages.javascript);
    t.falsy(Prism.languages.markup);

    // Load jsx, which depends on javascript and markup
    PrismLoader.load(Prism, 'jsx');

    t.truthy(Prism.languages.jsx);
    t.truthy(Prism.languages.javascript);
    t.truthy(Prism.languages.markup);
});
