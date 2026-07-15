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
      this.launcherState = null;
      this.launcherDragging = false;
      this.launcherDragMoved = false;
      this.launcherDragThreshold = 5;
      this.launcherPositionKey = "igrisLauncherPosition";
      this.launcherPointerOffset = { x: 0, y: 0 };
      this.launcherSize = { width: 0, height: 0 };

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
      this.restoreLauncherPosition();

      this.loadingState =
          new global.EmailAssistantLoadingState(this.root);

      this.registerEvents();

      this.setStatus("Ready", true);

    }

    async restoreLauncherPosition() {

      if (!this.launcher) {
        return;
      }

      const defaultPosition = {

        x: window.innerWidth - this.launcher.offsetWidth - 24,
        y: window.innerHeight - this.launcher.offsetHeight - 24,

      };

      let savedPosition = null;

      try {

        const result = await chrome.storage.local.get(
            this.launcherPositionKey
        );

        savedPosition = result[this.launcherPositionKey] || null;

      } catch (error) {

        savedPosition = null;

      }

      const position = this.clampToViewport(
          savedPosition || defaultPosition,
          this.launcher.offsetWidth,
          this.launcher.offsetHeight
      );

      this.setLauncherPosition(position.x, position.y);

    }

    async saveLauncherPosition(position) {

      if (!position) {
        return;
      }

      try {

        await chrome.storage.local.set({

          [this.launcherPositionKey]: position

        });

      } catch (error) {

        console.error("[IGRIS]", error);

      }

    }

    clampToViewport(position, width, height) {

      const margin = 12;
      const maxX = Math.max(margin, window.innerWidth - width - margin);
      const maxY = Math.max(margin, window.innerHeight - height - margin);

      return {

        x: Math.min(maxX, Math.max(margin, position.x)),
        y: Math.min(maxY, Math.max(margin, position.y)),

      };

    }

    setLauncherPosition(x, y, animate = false) {

      if (!this.launcher) {
        return;
      }

      this.launcher.style.left = `${Math.round(x)}px`;
      this.launcher.style.top = `${Math.round(y)}px`;
      this.launcher.style.right = "auto";
      this.launcher.style.bottom = "auto";
      this.launcher.style.transition = animate ? ".2s ease" : "none";

    }

    snapLauncherPosition(position) {

      const margin = 12;
      const snapThreshold = 24;
      const width = this.launcher.offsetWidth;
      const height = this.launcher.offsetHeight;
      const maxX = Math.max(margin, window.innerWidth - width - margin);
      const maxY = Math.max(margin, window.innerHeight - height - margin);

      let nextX = position.x;
      let nextY = position.y;

      if (nextX <= margin + snapThreshold) {
        nextX = margin;
      } else if (maxX - nextX <= snapThreshold) {
        nextX = maxX;
      }

      if (nextY <= margin + snapThreshold) {
        nextY = margin;
      } else if (maxY - nextY <= snapThreshold) {
        nextY = maxY;
      }

      return this.clampToViewport({ x: nextX, y: nextY }, width, height);

    }

    calculateBestPanelPosition() {

      const launcherRect = this.launcher.getBoundingClientRect();
      const panelRect = this.root.getBoundingClientRect();
      const margin = 12;
      const gap = 14;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const spaceLeft = launcherRect.left - margin;
      const spaceRight = viewportWidth - launcherRect.right - margin;
      const spaceAbove = launcherRect.top - margin;
      const spaceBelow = viewportHeight - launcherRect.bottom - margin;

      let x;
      if (spaceRight >= panelRect.width + gap) {
        x = launcherRect.right + gap;
      } else if (spaceLeft >= panelRect.width + gap) {
        x = launcherRect.left - panelRect.width - gap;
      } else {
        x = spaceRight >= spaceLeft
            ? launcherRect.right + gap
            : launcherRect.left - panelRect.width - gap;
      }

      let y;
      if (spaceBelow >= panelRect.height + gap) {
        y = launcherRect.bottom + gap;
      } else if (spaceAbove >= panelRect.height + gap) {
        y = launcherRect.top - panelRect.height - gap;
      } else {
        y = spaceBelow >= spaceAbove
            ? launcherRect.bottom + gap
            : launcherRect.top - panelRect.height - gap;
      }

      const clampedX = Math.min(
          viewportWidth - panelRect.width - margin,
          Math.max(margin, x)
      );
      const clampedY = Math.min(
          viewportHeight - panelRect.height - margin,
          Math.max(margin, y)
      );

      return {
        x: clampedX,
        y: clampedY,
      };

    }

    setPanelPositionFromLauncher() {

      if (!this.root || !this.launcher) {
        return;
      }

      const position = this.calculateBestPanelPosition();

      this.root.style.left = `${Math.round(position.x)}px`;
      this.root.style.top = `${Math.round(position.y)}px`;
      this.root.style.right = "auto";
      this.root.style.bottom = "auto";
      this.root.style.transformOrigin = "bottom left";

      console.log("[IGRIS] panel inline left:", this.root.style.left);
      console.log("[IGRIS] panel inline top:", this.root.style.top);
      console.log(
          "[IGRIS] panel computed style:",
          {
            left: getComputedStyle(this.root).left,
            top: getComputedStyle(this.root).top,
            right: getComputedStyle(this.root).right,
            bottom: getComputedStyle(this.root).bottom,
            transform: getComputedStyle(this.root).transform,
            position: getComputedStyle(this.root).position,
          }
      );

      return position;

    }

    beginLauncherDrag(event) {

      const rect = this.launcher.getBoundingClientRect();

      this.launcherDragging = true;
      this.launcherDragMoved = false;
      this.launcherState = {

        startX: event.clientX,
        startY: event.clientY,

      };
      this.launcherPointerOffset = {

        x: event.clientX - rect.left,
        y: event.clientY - rect.top,

      };

      this.launcherSize = {

        width: rect.width,
        height: rect.height,

      };

      this.launcher.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      this.launcher.setPointerCapture(event.pointerId);
      event.preventDefault();

    }

    moveLauncher(event) {

      if (!this.launcherDragging) {
        return;
      }

      const movedDistance = Math.hypot(
          event.clientX - this.launcherState.startX,
          event.clientY - this.launcherState.startY
      );

      if (!this.launcherDragMoved && movedDistance < this.launcherDragThreshold) {
        return;
      }

      this.launcherDragMoved = true;

      const nextPosition = this.clampToViewport(
          {
            x: event.clientX - this.launcherPointerOffset.x,
            y: event.clientY - this.launcherPointerOffset.y,
          },
          this.launcherSize.width,
          this.launcherSize.height
      );

      const current = this.launcher.getBoundingClientRect();
      const deltaX = Math.abs(nextPosition.x - current.left);
      const deltaY = Math.abs(nextPosition.y - current.top);

      if (deltaX > 2 || deltaY > 2) {
        this.launcherDragMoved = true;
      }

      this.setLauncherPosition(nextPosition.x, nextPosition.y);

    }

    async endLauncherDrag(event) {

      if (!this.launcherDragging) {
        return;
      }

      this.launcherDragging = false;
      this.launcherState = null;
      this.launcher.style.cursor = "pointer";
      document.body.style.userSelect = "";

      try {

        this.launcher.releasePointerCapture(event.pointerId);

      } catch (error) {

        // Pointer capture may already be released.

      }

      const rect = this.launcher.getBoundingClientRect();
      const snapped = this.snapLauncherPosition({

        x: rect.left,
        y: rect.top,

      });

      this.setLauncherPosition(snapped.x, snapped.y, true);
      await this.saveLauncherPosition(snapped);

      if (this.launcherDragMoved) {
        // Drag completed; click handler will suppress opening.
      }

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

      this.launcher.dataset.ewsLauncher = "true";

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

      this.launcher.addEventListener(
          "pointerdown",
          event => this.beginLauncherDrag(event)
      );

      this.launcher.addEventListener(
          "pointermove",
          event => this.moveLauncher(event)
      );

      this.launcher.addEventListener(
          "pointerup",
          event => this.endLauncherDrag(event)
      );

      this.launcher.addEventListener(
          "pointercancel",
          event => this.endLauncherDrag(event)
      );

      this.launcher.addEventListener(
          "click",
          event => {

            if (this.launcherDragMoved) {

              event.preventDefault();
              event.stopImmediatePropagation();
              this.launcherDragMoved = false;

              return;

            }

            this.toggleWidget();

          }
      );

    }

    toggleWidget() {

      if (this.root.style.display === "none") {

        this.root.style.display = "flex";
        this.root.style.visibility = "hidden";

        requestAnimationFrame(() => {

          const position = this.setPanelPositionFromLauncher();

          if (position) {

            this.root.style.left = `${Math.round(position.x)}px`;
            this.root.style.top = `${Math.round(position.y)}px`;

          }

          this.root.style.visibility = "";

          this.root.classList.add("mounted");

        });

      } else {

        this.root.classList.remove("mounted");

        setTimeout(() => {

          this.root.style.display = "none";
          this.launcher.style.transition = "";

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
      this.error.style.display = "none";

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
      this.error.style.display = "flex";

      this.error.classList.add("show");

      this.errorTimeout = setTimeout(() => {

        this.error.classList.remove("show");

        this.error.hidden = true;
        this.error.style.display = "none";

      }, 5000);

    }

  }

  global.EmailAssistantWidget = AssistantWidget;

})(window);
