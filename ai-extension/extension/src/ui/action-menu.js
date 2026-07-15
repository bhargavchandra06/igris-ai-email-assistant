(function attachActionMenu(global) {

  class ActionMenu {

    constructor() {

      this.value = "reply";
      this.buttons = [];
      this.element = null;

    }

    render() {

      this.element = document.createElement("div");
      this.element.className = "ews-action-menu";
      this.element.setAttribute("role", "radiogroup");
      this.element.setAttribute("aria-label", "Email Actions");

      const actions = [

        {
          value: "reply",
          label: "Reply",
          icon: "reply"
        },

        {
          value: "generate",
          label: "Generate",
          icon: "sparkles"
        },

        {
          value: "improve",
          label: "Improve",
          icon: "wand-2"
        },

        {
          value: "grammar",
          label: "Grammar",
          icon: "spell-check"
        },

        {
          value: "tone",
          label: "Tone",
          icon: "message-circle-more"
        },

        {
          value: "subject",
          label: "Subject",
          icon: "mail"
        },

        {
          value: "summarize",
          label: "Summary",
          icon: "file-text"
        }

      ];

      actions.forEach(action => {

        const chip = document.createElement("button");

        chip.type = "button";

        chip.className = "ews-action-chip";

        chip.dataset.value = action.value;

        chip.setAttribute("role", "radio");

        chip.setAttribute(
            "aria-checked",
            action.value === this.value
        );

        chip.innerHTML = `

                    <span
                        class="ews-chip-icon"
                        aria-hidden="true">

                        <i data-lucide="${action.icon}"></i>

                    </span>

                    <span class="ews-chip-label">

                        ${action.label}

                    </span>

                `;

        if (action.value === this.value) {

          chip.classList.add("active");

        }

        chip.addEventListener("click", () => {

          this.select(action.value);

        });

        chip.addEventListener("keydown", event => {

          if (
              event.key === "Enter" ||
              event.key === " "
          ) {

            event.preventDefault();

            this.select(action.value);

          }

        });

        this.buttons.push(chip);

        this.element.appendChild(chip);

      });

      if (window.lucide) {

        window.lucide.createIcons({

          attrs: {

            width: 18,
            height: 18,
            stroke: "currentColor"

          }

        });

      }

      return this.element;

    }

    select(value) {

      this.value = value;

      this.buttons.forEach(button => {

        const active =
            button.dataset.value === value;

        button.classList.toggle(
            "active",
            active
        );

        button.setAttribute(
            "aria-checked",
            active
        );

      });

      this.element.dispatchEvent(

          new CustomEvent("change", {

            bubbles: true,

            detail: {

              action: value

            }

          })

      );

    }

  }

  global.EmailAssistantActionMenu = ActionMenu;

})(window);