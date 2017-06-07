module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                // All components should be wrapped in a closure
                test: /components\/prism-\w*\.js$/,
                loader: "./closure-loader.js"
            }
        ]
    }
};
