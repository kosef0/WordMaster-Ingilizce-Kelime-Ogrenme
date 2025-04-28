// setImmediate polyfill
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = function(callback) {
    const args = Array.prototype.slice.call(arguments, 1);
    return setTimeout(() => callback.apply(null, args), 0);
  };
}

if (typeof global.clearImmediate === 'undefined') {
  global.clearImmediate = function(id) {
    clearTimeout(id);
  };
}