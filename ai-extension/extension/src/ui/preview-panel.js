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

                <div
                    class="ews-preview-subject"
                    data-ews-subject
                    hidden>

                </div>

                <pre
                    class="ews-preview-body"
                    data-ews-body
                    hidden>

                </pre>

                <div
                    class="ews-preview-warnings"
                    data-ews-warnings
                    hidden>

                </div>

                <div
                    class="ews-preview-actions"
                    data-ews-actions
                    hidden>

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

      this.cache();

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

      this.empty =
          this.element.querySelector("[data-ews-empty]");

      this.subject =
          this.element.querySelector("[data-ews-subject]");

      this.body =
          this.element.querySelector("[data-ews-body]");

      this.warnings =
          this.element.querySelector("[data-ews-warnings]");

      this.actions =
          this.element.querySelector("[data-ews-actions]");

      this.copyButton =
          this.element.querySelector("[data-ews-copy]");

    }

    bind(){

      this.element
          .querySelector("[data-ews-close]")
          .addEventListener("click",()=>this.hide());

      this.element
          .querySelector("[data-ews-copy]")
          .addEventListener("click",()=>this.copy());

      this.element
          .querySelector("[data-ews-insert]")
          .addEventListener("click",()=>{

            if(this.response){

              this.onInsert(this.response);

            }

          });

    }

    show(response){

      this.response=response;

      this.empty.hidden=true;

      this.actions.hidden=false;

      this.subject.hidden=!response.subject;

      this.subject.textContent=response.subject
          ?`Subject\n${response.subject}`
          :"";

      this.body.hidden=false;

      this.body.textContent=response.body||"";

      const warningText=Array.isArray(response.warnings)
          ?response.warnings.join("\n")
          :"";

      this.warnings.hidden=!warningText;

      this.warnings.textContent=warningText;

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

      this.empty.hidden=false;

      this.subject.hidden=true;

      this.body.hidden=true;

      this.warnings.hidden=true;

      this.actions.hidden=true;

    }

  }

  global.EmailAssistantPreviewPanel=PreviewPanel;

})(window);