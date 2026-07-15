(function attachGmailDomAdapter(global) {
  class GmailDomAdapter {
    isGmail() {
      return location.hostname === "mail.google.com";
    }

    getOpenEmailText() {
      const candidates = [
        ...document.querySelectorAll("[data-message-id] .a3s"),
        ...document.querySelectorAll(".ii.gt .a3s"),
        ...document.querySelectorAll("[role='main'] .a3s")
      ];
      return candidates
        .map((node) => node.innerText)
        .filter(Boolean)
        .join("\n\n")
        .trim();
    }

    getThreadText() {
      const thread = document.querySelector("[role='main']");
      return thread ? thread.innerText.trim() : "";
    }

    getActiveComposeBody() {
      const body = this.findComposeBody();
      return body ? body.innerText.trim() : "";
    }

    findComposeBody() {
      const selectors = [
        "div[aria-label='Message Body'][contenteditable='true']",
        "div[role='textbox'][aria-label='Message Body']",
        "div[contenteditable='true'][g_editable='true']"
      ];
      for (const selector of selectors) {
        const node = document.querySelector(selector);
        if (node) {
          return node;
        }
      }
      return null;
    }

    findSubjectInput() {
      return document.querySelector("input[name='subjectbox']");
    }
  }

  global.EmailAssistantGmailDomAdapter = GmailDomAdapter;
})(window);
