#!/usr/bin/env node
/* eslint-disable truc */
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import { LANGUAGES, isCommon } from './src/componentDefinitions';

/*
    BUILD SCRIPT

    This script builds the following files:

    src/components/
    src/all-components.js
    src/common-components.js
 */

const LIST = Object.keys(LANGUAGES);

/**
 * Wrap a JS source in a closure function taking Prism as argument
 * @return {String}
 */
function prismClosure(source) {
    return `function (Prism) {\n${source}\n}\n`;
}

/**
 * Make a JS module that export the given JS expression
 * @return {String}
 */
function moduleExport(source) {
    return `export default ${source}`;
}

/*
 * Generate the sources for closured components
 */
function generateClosuredComponents() {
    const componentsDir = './src/components';

    // Cleanup
    childProcess.execSync(`rm -rf ${componentsDir}`);

    // Generate
    fs.mkdirSync(componentsDir);
    LIST.forEach(name => {
        const componentSrcPath = `./node_modules/prismjs/components/prism-${name}.js`;
        const componentSrc = fs.readFileSync(componentSrcPath);
        const moduleSrc = moduleExport(prismClosure(componentSrc));
        const outputPath = path.join(componentsDir, `prism-${name}.js`);
        fs.writeFileSync(outputPath, moduleSrc);
    });
}

/*
 * Generate a module exposing all components
 */
function generateComponentIndex() {
    function generateSource(list) {
        const requires = list
            .map(
                name =>
                    `  '${name}': require('./components/prism-${name}.js').default`
            )
            .join(',\n');
        return moduleExport(`{\n${requires}\n};\n`);
    }

    fs.writeFileSync('./src/all-components.js', generateSource(LIST));
    fs.writeFileSync(
        './src/common-components.js',
        generateSource(LIST.filter(isCommon))
    );
}

generateClosuredComponents();
generateComponentIndex();
