(function attachActionDropdown(global) {

    const coordinator = global.EmailAssistantDropdownCoordinator;

    class ActionDropdown {

        constructor() {

            this.value = "reply";

            this.root = null;

            this.button = null;

            this.menu = null;

            this.label = null;

            this.icon = null;

            this.open = false;

            this.actions = [

                {
                    value: "reply",
                    label: "Reply",
                    icon: "reply"
                },

                {
                    value: "generate",
                    label: "Generate Email",
                    icon: "sparkles"
                },

                {
                    value: "improve",
                    label: "Improve Draft",
                    icon: "wand-2"
                },

                {
                    value: "grammar",
                    label: "Fix Grammar",
                    icon: "spell-check"
                },

                {
                    value: "tone",
                    label: "Change Tone",
                    icon: "message-circle-more"
                },

                {
                    value: "subject",
                    label: "Generate Subject",
                    icon: "mail"
                },

                {
                    value: "summarize",
                    label: "Summarize",
                    icon: "file-text"
                }

            ];

        }

        render() {

            this.root = document.createElement("div");

            this.root.className = "ews-action-dropdown";

            this.button = document.createElement("button");

            this.button.type = "button";

            this.button.className = "ews-action-button";

            this.icon = document.createElement("span");

            this.icon.className = "ews-action-icon";

            this.label = document.createElement("span");

            this.label.className = "ews-action-value";

            const arrow = document.createElement("span");

            arrow.className = "ews-action-arrow";

            arrow.innerHTML =
                '<i data-lucide="chevron-down"></i>';

            this.button.append(

                this.icon,

                this.label,

                arrow

            );

            this.menu = document.createElement("div");

            this.menu.className =
                "ews-tone-menu ews-action-dropdown-menu";

            this.actions.forEach(action => {

                const item = document.createElement("button");

                item.type = "button";

                item.className =
                    "ews-tone-item ews-action-dropdown-item";

                item.dataset.value = action.value;

                if (action.value === this.value) {

                    item.classList.add("active");

                }

                item.innerHTML = `

            <i data-lucide="${action.icon}"></i>

            <span>${action.label}</span>

        `;

                item.addEventListener(

                    "click",

                    () => this.select(action)

                );

                this.menu.appendChild(item);

            });

            this.button.addEventListener(

                "click",

                () => this.toggle()

            );

            document.addEventListener(

                "click",

                event => {

                    if (
                        !this.root.contains(event.target) &&
                        !this.menu.contains(event.target)
                    ) {

                        this.close();

                    }

                }

            );

            this.root.append(

                this.button,

                this.menu

            );

            this.select(this.actions[0]);

            if (coordinator) {

                coordinator.register(this);

            }

            if (window.lucide) {

                window.lucide.createIcons();

            }

            return this.root;

        }

        select(action) {

            this.value = action.value;

            this.icon.innerHTML =
                `<i data-lucide="${action.icon}"></i>`;

            this.label.textContent =
                action.label;

            this.menu.querySelectorAll(".ews-action-dropdown-item")
                .forEach(item => {

                    item.classList.toggle(
                        "active",
                        item.dataset.value === action.value
                    );

                });

            this.close();

            this.root.dispatchEvent(
                new Event("change")
            );

            if (window.lucide) {

                window.lucide.createIcons();

            }

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

            this.menu.classList.toggle("show", open);

            this.root.classList.toggle("dropdown-open", open);

            this.button.classList.toggle("open", open);

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

        destroy() {

            if (coordinator) {

                coordinator.unregister(this);

            }

        }

    }

    global.EmailAssistantActionDropdown =
        ActionDropdown;

})(window);
