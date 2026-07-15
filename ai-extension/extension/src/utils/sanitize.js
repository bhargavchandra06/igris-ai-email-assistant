(function attachSanitize(global) {
  global.EmailAssistantSanitize = {
    text(value) {
      if (!value) {
        return "";
      }
      return String(value).replace(/\s+/g, " ").trim();
    }
  };
})(window);
