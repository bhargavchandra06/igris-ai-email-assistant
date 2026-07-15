(function attachPreviewPanel(global) {

  class PreviewPanel {

    constructor(onInsert) {

      this.onInsert = onInsert;

      this.response = null;

      this.element = document.createElement("section");
      this.element.className = "ews-preview-panel";

    }

    render() {

      this.element.innerHTML = `

                <div class="ews-preview-header">

                    <div class="ews-preview-title">

                        <i data-lucide="sparkles"></i>

                        <span>AI Response</span>

                    </div>

                    <button
                        class="ews-icon-button"
                        data-ews-close
                        type="button"
                        aria-label="Close">

                        <i data-lucide="x"></i>

                    </button>

                </div>

                <div data-ews-content></div>

            `;

      this.cache();

      this.renderEmptyState();

      this.bind();

      if (window.lucide) {

        window.lucide.createIcons({

          attrs:{

            width:18,

            height:18

          }

        });

      }

      return this.element;

    }

    cache(){

      this.content =
          this.element.querySelector("[data-ews-content]");

      this.empty =
          null;

      this.subject = null;

      this.body = null;

      this.warnings = null;

      this.actions = null;

      this.copyButton = null;

    }

    bind(){

      this.element
          .querySelector("[data-ews-close]")
          .addEventListener("click",()=>this.hide());

      this.element
          .addEventListener("click", event => {

            const copyButton =
                event.target.closest("[data-ews-copy]");

            if (copyButton) {

              this.copy();

              return;

            }

            const insertButton =
                event.target.closest("[data-ews-insert]");

            if (insertButton && this.response) {

              this.onInsert(this.response);

            }

          });

    }

    renderEmptyState() {

      this.content.innerHTML = `

                <div
                    class="ews-preview-empty"
                    data-ews-empty>

                    <i data-lucide="bot"></i>

                    <h3>Ready to write</h3>

                    <p>

                        Choose an action and click Generate.

                        Your AI response will appear here.

                    </p>

                </div>

            `;

      this.empty = this.content.querySelector("[data-ews-empty]");

      this.subject = null;

      this.body = null;

      this.warnings = null;

      this.actions = null;

      this.copyButton = null;

      if (window.lucide) {

        window.lucide.createIcons({

          attrs:{

            width:18,

            height:18

          }

        });

      }

    }

    renderResponseState(response) {

      const subjectText =
          response.subject
              ? `Subject\n${response.subject}`
              : "";

      const warningText = Array.isArray(response.warnings)
          ? response.warnings.join("\n")
          : "";

      this.content.innerHTML = `

                <div
                    class="ews-preview-subject"
                    data-ews-subject
                    ${response.subject ? "" : "hidden"}>

                </div>

                <pre
                    class="ews-preview-body"
                    data-ews-body>

                </pre>

                <div
                    class="ews-preview-warnings"
                    data-ews-warnings
                    ${warningText ? "" : "hidden"}>

                </div>

                <div
                    class="ews-preview-actions"
                    data-ews-actions>

                    <button
                        type="button"
                        data-ews-copy>

                        <i data-lucide="copy"></i>

                        <span>Copy</span>

                    </button>

                    <button
                        type="button"
                        data-ews-insert>

                        <i data-lucide="corner-down-left"></i>

                        <span>Insert</span>

                    </button>

                </div>

            `;

      this.empty = null;
      this.subject = this.element.querySelector("[data-ews-subject]");
      this.body = this.element.querySelector("[data-ews-body]");
      this.warnings = this.element.querySelector("[data-ews-warnings]");
      this.actions = this.element.querySelector("[data-ews-actions]");
      this.copyButton = this.element.querySelector("[data-ews-copy]");

      this.subject.textContent = subjectText;
      this.body.textContent = response.body || "";
      this.warnings.textContent = warningText;

      if (window.lucide) {

        window.lucide.createIcons({

          attrs:{

            width:18,

            height:18

          }

        });

      }

    }

    show(response){

      const normalizedResponse = response || {};
      const hasContent =
          Boolean(
              (normalizedResponse.body &&
                  String(normalizedResponse.body).trim()) ||
              (normalizedResponse.subject &&
                  String(normalizedResponse.subject).trim()) ||
              (Array.isArray(normalizedResponse.warnings) &&
                  normalizedResponse.warnings.some(
                      warning => String(warning || "").trim()
                  ))
          );

      this.response = hasContent ? normalizedResponse : null;

      if (!hasContent) {

        this.renderEmptyState();

        return;

      }

      this.renderResponseState(normalizedResponse);

    }

    async copy(){

      if(!this.response)return;

      const text=[

        this.response.subject
            ?`Subject: ${this.response.subject}`
            :"",

        this.response.body||""

      ]

          .filter(Boolean)

          .join("\n\n");

      try{

        await navigator.clipboard.writeText(text);

        const span=this.copyButton.querySelector("span");

        span.textContent="Copied";

        setTimeout(()=>{

          span.textContent="Copy";

        },1800);

      }

      catch(err){

        console.error(err);

      }

    }

    hide(){

      this.response=null;
      this.renderEmptyState();

    }

  }

  global.EmailAssistantPreviewPanel=PreviewPanel;

})(window);
