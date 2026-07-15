(function attachBackendClient(global) {
  class BackendClient {
    request(action, payload) {
      return chrome.runtime.sendMessage({
        type: global.EmailAssistantConstants.messageTypes.emailRequest,
        action,
        payload
      });
    }
  }

  global.EmailAssistantBackendClient = BackendClient;
})(window);
