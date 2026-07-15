(function attachAssistantWidget(global) {

  class AssistantWidget {

    constructor({
                  backendClient,
                  gmailDomAdapter,
                  composeAdapter
                }) {

      this.backendClient = backendClient;
      this.gmailDomAdapter = gmailDomAdapter;
      this.composeAdapter = composeAdapter;


      this.previewPanel = null;

      this.actionMenuComponent = null;
      this.actionMenu = null;

      this.toneSelectorComponent = null;
      this.toneSelector = null;

      this.instruction = null;
      this.runButton = null;
      this.error = null;

      this.loadingState = null;

      this.errorTimeout = null;

      this.launcher = null;
      this.isCollapsed = true;

    }
    mount() {

      if (document.querySelector("[data-ews-root]")) {
        return;
      }

      this.root = document.createElement("aside");
      this.root.className = "ews-root";
      this.root.dataset.ewsRoot = "true";

      this.root.style.display = "none";

      this.createHeader();
      this.createActionSection();
      this.createToneSection();
      this.createInstructionSection();
      this.createGenerateButton();
      this.createErrorSection();
      this.createPreviewSection();

      document.documentElement.appendChild(this.root);

      this.createLauncher();

      this.loadingState =
          new global.EmailAssistantLoadingState(this.root);

      this.registerEvents();

      this.setStatus("Ready", true);

    }

    createLauncher() {

      this.launcher = document.createElement("button");

      this.launcher.className = "ews-launcher";

      this.launcher.type = "button";

      this.launcher.innerHTML = `

        <i data-lucide="bot"></i>

        <div class="ews-launcher-text">

            <strong>IGRIS</strong>

            <span>AI Assistant</span>

        </div>

    `;

      document.documentElement.appendChild(
          this.launcher
      );

      if (window.lucide) {

        window.lucide.createIcons({

          attrs:{
            width:20,
            height:20
          }

        });

      }

    }

    toggleWidget() {

      if (this.root.style.display === "none") {

        this.launcher.style.display = "none";

        this.root.style.display = "flex";

        requestAnimationFrame(() => {

          this.root.classList.add("mounted");

        });

      } else {

        this.root.classList.remove("mounted");

        setTimeout(() => {

          this.root.style.display = "none";

          this.launcher.style.display = "flex";

        }, 250);

      }

    }
    createHeader() {

      const header =
          document.createElement("header");

      header.className = "ews-header";

      const logo =
          document.createElement("div");

      logo.className = "ews-logo";

      logo.innerHTML = `

                <i data-lucide="bot"></i>

            `;

      const titleGroup =
          document.createElement("div");

      titleGroup.className =
          "ews-title-group";

      const title =
          document.createElement("h2");

      title.textContent = "IGRIS";

      const subtitle =
          document.createElement("p");

      subtitle.textContent =
          "AI Email Assistant";

      const status =
          document.createElement("div");

      status.className =
          "ews-status";

      status.innerHTML = `

                <span class="ews-status-dot"></span>

                <span>Ready</span>

            `;

      titleGroup.append(

          title,

          subtitle,

          status

      );

      const closeButton =
          document.createElement("button");

      closeButton.className =
          "ews-close-button";

      closeButton.type = "button";

      closeButton.innerHTML = "x";

      closeButton.addEventListener(

          "click",

          () => this.toggleWidget()

      );

      header.append(

          logo,

          titleGroup,

          closeButton

      );

      this.root.appendChild(header);

      if (window.lucide) {

        window.lucide.createIcons({

          attrs: {

            width: 20,

            height: 20,

          }

        });

      }

    }

    createActionSection() {

      const section =
          document.createElement("section");

      section.className = "ews-section";

      const label =
          document.createElement("label");

      label.className = "ews-label";

      label.textContent = "Choose Action";

      this.actionMenuComponent =
          new global.EmailAssistantActionDropdown();

      this.actionMenu =
          this.actionMenuComponent.render();

      section.append(

          label,

          this.actionMenu

      );

      this.root.appendChild(section);

    }

    createToneSection() {

      const section =
          document.createElement("section");

      section.className = "ews-section";

      this.toneLabel =
          document.createElement("label");

      this.toneLabel.className =
          "ews-label";

      this.toneLabel.textContent = "Tone";

      this.toneSelectorComponent =
          new global.EmailAssistantToneSelector();

      this.toneSelector =
          this.toneSelectorComponent.render();

      section.append(

          this.toneLabel,

          this.toneSelector

      );

      this.root.appendChild(section);

    }

    createInstructionSection() {

      const section =
          document.createElement("section");

      section.className = "ews-section";

      const label =
          document.createElement("label");

      label.className = "ews-label";

      label.textContent =
          "Additional Instructions";

      this.instruction =
          document.createElement("textarea");

      this.instruction.className =
          "ews-instruction";

      this.instruction.rows = 4;

      this.instruction.maxLength = 1000;

      this.instruction.placeholder =

          `Tell IGRIS exactly what you need...

Examples

• Make it concise

• Sound more professional

• Add urgency

• Mention tomorrow's meeting

• Improve clarity

• Rewrite politely`;

      section.append(

          label,

          this.instruction

      );

      this.root.appendChild(section);

    }
    createGenerateButton() {

      const section =
          document.createElement("section");

      section.className =
          "ews-section";

      this.runButton =
          document.createElement("button");

      this.runButton.type = "button";

      this.runButton.dataset.ewsRun = "true";

      this.runButton.className =
          "ews-primary-button";

      this.runButton.innerHTML = `

                <i data-lucide="sparkles"></i>

                <span>

                    Generate Reply

                </span>

            `;

      section.appendChild(
          this.runButton
      );

      this.root.appendChild(
          section
      );

      if (window.lucide) {

        window.lucide.createIcons({

          attrs:{

            width:18,

            height:18,

            stroke:"currentColor"

          }

        });

      }

    }

    createErrorSection() {

      this.error =
          document.createElement("div");

      this.error.className =
          "ews-error";

      this.error.hidden = true;

      this.error.setAttribute(
          "role",
          "alert"
      );

      this.root.appendChild(
          this.error
      );

    }

    createPreviewSection() {

      this.previewPanel =
          new global.EmailAssistantPreviewPanel(

              response => {

                const inserted =
                    this.composeAdapter.insert(
                        response
                    );

                if (!inserted) {

                  this.showError(

                      "Open a Gmail compose or reply box before inserting."

                  );

                  return;

                }

              }

          );

      this.root.appendChild(

          this.previewPanel.render()

      );

    }
    registerEvents() {

      /* ----------------------------------
         Action Menu
      ----------------------------------- */

      this.launcher.addEventListener(

          "click",

          () => this.toggleWidget()

      );

      this.actionMenu.addEventListener(

          "change",

          () => {

            this.updateUi();

          }

      );

      /* ----------------------------------
         Tone Selector
      ----------------------------------- */

      this.toneSelector.addEventListener(

          "change",

          () => {

            this.updateUi();

          }

      );

      /* ----------------------------------
         Generate Button
      ----------------------------------- */

      this.runButton.addEventListener(

          "click",

          async () => {

            await this.handleGenerate();

          }

      );

      /* ----------------------------------
         Ctrl + Enter
      ----------------------------------- */

      this.instruction.addEventListener(

          "keydown",

          async event => {

            if (

                (event.ctrlKey || event.metaKey) &&

                event.key === "Enter"

            ) {

              event.preventDefault();

              await this.handleGenerate();

            }

          }

      );

      /* ----------------------------------
         Initial UI
      ----------------------------------- */

      this.updateUi();

    }
    updateUi(action = this.actionMenuComponent.value) {

      const labels = {

        reply: "Generate Reply",

        generate: "Generate Email",

        improve: "Improve Draft",

        grammar: "Fix Grammar",

        tone: "Change Tone",

        subject: "Generate Subject",

        summarize: "Summarize Email"

      };

      const hideTone =

          action === "grammar" ||

          action === "summarize";

      this.runButton.innerHTML = `

                <i data-lucide="sparkles"></i>

                <span>

                    ${labels[action] || "Generate"}

                </span>

            `;

      this.toneSelector.parentElement.hidden = hideTone;

      this.toneLabel.textContent =

          action === "tone"

              ? "Target Tone"

              : "Tone";

      if (window.lucide) {

        window.lucide.createIcons({

          attrs:{

            width:18,

            height:18

          }

        });

      }

    }
    async handleGenerate() {

      if (!this.loadingState) {
        return;
      }

      this.error.hidden = true;

      this.loadingState.setLoading(true);

      try {

        const action =
            this.actionMenuComponent.value;

        const tone =
            this.toneSelectorComponent.value;

        const instruction =
            this.instruction.value.trim();

        const payload = this.buildPayload(

            action,

            tone,

            instruction

        );

        const result =
            await this.backendClient.request(

                action,

                payload

            );

        if (!result) {

          throw new Error(

              "No response received from server."

          );

        }

        if (!result.ok) {

          throw new Error(

              result.error ||

              "Request failed."

          );

        }

        if (!result.data) {

          throw new Error(

              "Empty response received."

          );

        }

        this.previewPanel.show(result.data);

        this.setStatus(
            "Response Ready",
            true
        );

      }

      catch (error) {

        console.error(

            "[IGRIS]",

            error

        );

        this.showError(

            error.message ||

            "Unexpected error occurred."

        );

        this.setStatus(
            "Request Failed",
            false
        );
      }

      finally {

        this.loadingState.setLoading(false);
        setTimeout(() => {

          this.setStatus(
              "Ready",
              true
          );

        }, 2500);

      }

    }
    buildPayload(action, tone, instruction) {

      const cleanInstruction =
          global.EmailAssistantSanitize.text(
              instruction
          );

      const openEmail =
          this.gmailDomAdapter.getOpenEmailText();

      const threadText =
          this.gmailDomAdapter.getThreadText();

      const draft =
          this.gmailDomAdapter.getActiveComposeBody();

      switch (action) {

        case "generate":

          return {

            prompt:
                cleanInstruction ||
                "Write a complete email.",

            tone

          };

        case "reply":

          return {

            originalEmail:
                openEmail || threadText,

            threadContext:
            threadText,

            replyInstruction:
            cleanInstruction,

            tone

          };

        case "improve":

          return {

            draft,

            improvementInstruction:
            cleanInstruction,

            tone

          };

        case "grammar":

          return {

            content:
                draft ||
                openEmail ||
                threadText,

            preserveTone: true

          };

        case "tone":

          return {

            content:
                draft ||
                openEmail ||
                threadText,

            targetTone: tone

          };

        case "subject":

          return {

            body:
                draft ||
                openEmail ||
                threadText,

            tone,

            additionalContext:
            cleanInstruction

          };

        case "summarize":

          return {

            content:
                openEmail ||
                threadText,

            summaryStyle: "SHORT",

            focus:
            cleanInstruction

          };

        default:

          throw new Error(
              `Unsupported action: ${action}`
          );

      }

    }
    setStatus(text, online = true) {

      const label =
          this.root.querySelector(".ews-status span:last-child");

      const dot =
          this.root.querySelector(".ews-status-dot");

      if (!label || !dot) return;

      label.textContent = text;

      dot.style.background =
          online
              ? "#22c55e"
              : "#ef4444";

      dot.style.boxShadow =
          online
              ? "0 0 10px #22c55e"
              : "0 0 10px #ef4444";

    }

    clearInstruction() {

      if (this.instruction) {

        this.instruction.value = "";

      }

    }
    focusInstruction() {

      this.instruction?.focus();

    }

    reset() {

      this.clearInstruction();

      this.previewPanel.hide();

      this.error.hidden = true;

      this.setStatus(
          "Ready",
          true
      );

    }
    animateIn() {

      this.root.classList.add("mounted");

    }

    animateOut() {

      this.root.classList.remove("mounted");

    }

    disable() {

      this.runButton.disabled = true;

    }

    enable() {

      this.runButton.disabled = false;

    }


    showError(message) {

      if (!this.error) {
        return;
      }

      clearTimeout(this.errorTimeout);

      this.error.textContent = message;

      this.error.hidden = false;

      this.error.classList.add("show");

      this.errorTimeout = setTimeout(() => {

        this.error.classList.remove("show");

        this.error.hidden = true;

      }, 5000);

    }

  }

  global.EmailAssistantWidget = AssistantWidget;

})(window);
