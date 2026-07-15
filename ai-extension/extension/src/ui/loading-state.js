(function attachLoadingState(global) {

  class LoadingState {

    constructor(root) {

      this.root = root;

      this.button =
          root.querySelector("[data-ews-run]");

      this.loading = false;

      this.previousHTML = "";

    }

    setLoading(isLoading) {

      if (!this.button) return;

      if (this.loading === isLoading) return;

      this.loading = isLoading;

      this.root.classList.toggle(
          "ews-loading",
          isLoading
      );

      this.button.disabled = isLoading;

      if (isLoading) {

        this.previousHTML =
            this.button.innerHTML;

        this.button.innerHTML = `

                    <span class="ews-loader"></span>

                    <span>

                        Generating Response...

                    </span>

                `;

      } else {

        this.button.innerHTML =
            this.previousHTML;

        if (window.lucide) {

          window.lucide.createIcons({

            attrs:{

              width:18,

              height:18

            }

          });

        }

      }

    }

  }

  global.EmailAssistantLoadingState =
      LoadingState;

})(window);
