(function attachToneSelector(global) {

  const coordinator = global.EmailAssistantDropdownCoordinator;

  class ToneSelector {

    constructor() {

      this.value = "PROFESSIONAL";

      this.root = null;
      this.button = null;
      this.menu = null;
      this.label = null;
      this.arrow = null;

      this.open = false;

    }

    render() {

      this.root = document.createElement("div");
      this.root.className = "ews-tone-dropdown";

      this.button = document.createElement("button");
      this.button.type = "button";
      this.button.className = "ews-tone-button";
      this.button.setAttribute("aria-haspopup", "listbox");
      this.button.setAttribute("aria-expanded", "false");

      this.label = document.createElement("span");
      this.label.className = "ews-tone-value";
      this.label.textContent = this.format(this.value);

      this.arrow = document.createElement("span");
      this.arrow.className = "ews-tone-arrow";
      this.arrow.innerHTML =
          '<i data-lucide="chevron-down"></i>';

      this.button.append(
          this.label,
          this.arrow
      );

      this.menu = document.createElement("div");
      this.menu.className = "ews-tone-menu";
      this.menu.setAttribute("role", "listbox");

      global.EmailAssistantConstants.tones.forEach(tone => {

        const item = document.createElement("button");

        item.type = "button";

        item.className = "ews-tone-item";

        item.dataset.value = tone;

        item.setAttribute("role", "option");

        item.textContent = this.format(tone);

        if (tone === this.value) {
          item.classList.add("active");
        }

        item.addEventListener("click", () => {

          this.select(tone);

        });

        this.menu.appendChild(item);

      });

      this.button.addEventListener("click", e => {

        e.stopPropagation();

        this.toggle();

      });

      document.addEventListener("click", e => {

        if (
          !this.root.contains(e.target) &&
          !this.menu.contains(e.target)
        ) {

          this.close();

        }

      });

      this.root.append(
          this.button,
          this.menu
      );

      if (coordinator) {

        coordinator.register(this);

      }

      if (window.lucide) {

        window.lucide.createIcons({

          attrs: {

            width: 18,
            height: 18,
            stroke: "currentColor"

          }

        });

      }

      return this.root;

    }

    select(value) {

      this.value = value;

      this.label.textContent =
          this.format(value);

      this.menu.querySelectorAll(".ews-tone-item")
          .forEach(item => {

            item.classList.toggle(

                "active",

                item.dataset.value === value

            );

          });

      this.close();

      this.root.dispatchEvent(

          new CustomEvent("change", {

            bubbles: true,

            detail: {

              tone: value

            }

          })

      );

    }

    toggle() {

      if (this.open) {

        this.close();

        return;

      }

      if (coordinator) {

        coordinator.open(this);

        return;

      }

      this.setOpenState(true);

    }

    setOpenState(open) {

      this.open = open;

      this.menu.classList.toggle(
          "show",
          open
      );

      this.root.classList.toggle(
          "dropdown-open",
          open
      );

      this.button.setAttribute(
          "aria-expanded",
          open
      );

      this.arrow.classList.toggle(
          "rotate",
          open
      );

      const section = this.root.closest(".ews-section");

      if (section) {

        section.style.zIndex = open ? "2000" : "";

      }

    }

    close({ fromCoordinator = false } = {}) {

      if (!this.open && !fromCoordinator) {

        return;

      }

      this.setOpenState(false);

    }

    format(value) {

      return value.charAt(0) +
          value.slice(1).toLowerCase();

    }

  }

  global.EmailAssistantToneSelector = ToneSelector;

})(window);
