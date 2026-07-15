(function attachComposeAdapter(global) {
  class ComposeAdapter {
    constructor(gmailDomAdapter) {
      this.gmailDomAdapter = gmailDomAdapter;
    }

    insert(response) {
      if (!response) {
        return false;
      }

      let inserted = false;
      if (response.subject) {
        inserted = this.insertSubject(response.subject) || inserted;
      }
      if (response.body) {
        inserted = this.insertBody(response.body) || inserted;
      }
      return inserted;
    }

    insertBody(body) {
      const composeBody = this.gmailDomAdapter.findComposeBody();
      if (!composeBody) {
        return false;
      }
      composeBody.focus();
      composeBody.innerText = body;
      composeBody.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: body }));
      return true;
    }

    insertSubject(subject) {
      const subjectInput = this.gmailDomAdapter.findSubjectInput();
      if (!subjectInput) {
        return false;
      }
      subjectInput.focus();
      subjectInput.value = subject;
      subjectInput.dispatchEvent(new Event("input", { bubbles: true }));
      subjectInput.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
  }

  global.EmailAssistantComposeAdapter = ComposeAdapter;
})(window);
