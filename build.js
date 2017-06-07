'use strict'

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var components = require('./components');

/**
 * Wrap a JS source in a closure function taking Prism as argument
 * @return {String}
 */
function prismClosure(source) {
    return 'function (Prism) {\n' + source + '\n}\n';
};

/**
 * Make a JS module that export the given JS expression
 * @return {String}
 */
function moduleExport(source) {
    return 'module.exports = ' + source;
};

/*
 * Generate the sources for closured components
 */
function generateClosuredComponents() {
    const componentsDir = './components';

    // Cleanup

    if (fs.statSync(componentsDir)) {
        child_process.execSync('rm -rf ' + componentsDir);
    }

    // Generate
    fs.mkdirSync(componentsDir);
    components.LIST.forEach(function (name) {
        var componentSrcPath = './node_modules/prismjs/components/prism-'+name+'.js';
        var componentSrc = fs.readFileSync(componentSrcPath);
        var moduleSrc = moduleExport(prismClosure(componentSrc));
        var outputPath = path.join(componentsDir, 'prism-'+name+'.js');
        fs.writeFileSync(outputPath, moduleSrc);
    })
}

generateClosuredComponents();
