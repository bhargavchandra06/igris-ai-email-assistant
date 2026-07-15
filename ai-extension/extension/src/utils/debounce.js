(function attachDebounce(global) {
  global.EmailAssistantDebounce = function debounce(callback, delayMs) {
    let timeoutId;
    return function debounced(...args) {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => callback.apply(this, args), delayMs);
    };
  };
})(window);
