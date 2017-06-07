// Wrap the module in a closure function taking Prism as argument
module.exports = function(source) {
    const closure = 'module.exports = function (Prism) {' + source + '}';
    return closure;
};
