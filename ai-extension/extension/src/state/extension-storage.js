(function attachExtensionStorage(global) {
  class ExtensionStorage {
    get(keys) {
      return chrome.storage.local.get(keys);
    }

    set(values) {
      return chrome.storage.local.set(values);
    }
  }

  global.EmailAssistantExtensionStorage = ExtensionStorage;
})(window);
