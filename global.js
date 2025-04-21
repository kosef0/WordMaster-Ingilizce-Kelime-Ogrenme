// This file provides polyfills for missing global functions

// setImmediate polyfill
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = function(callback) {
    const args = Array.prototype.slice.call(arguments, 1);
    const id = setTimeout(() => {
      callback.apply(null, args);
    }, 0);
    return id;
  };
}

// clearImmediate polyfill
if (typeof global.clearImmediate === 'undefined') {
  global.clearImmediate = function(id) {
    clearTimeout(id);
  };
}

// Add any other polyfills here if needed