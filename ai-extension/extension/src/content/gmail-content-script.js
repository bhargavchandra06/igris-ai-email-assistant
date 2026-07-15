(function initializeEmailAssistant(global) {

  const gmailDomAdapter =
      new global.EmailAssistantGmailDomAdapter();

  if (!gmailDomAdapter.isGmail()) {
    return;
  }

  const backendClient =
      new global.EmailAssistantBackendClient();

  const composeAdapter =
      new global.EmailAssistantComposeAdapter(
          gmailDomAdapter
      );

  const widget =
      new global.EmailAssistantWidget({

        backendClient,

        gmailDomAdapter,

        composeAdapter

      });

  let mounted = false;

  function ensureMounted() {

    if (mounted) {
      return;
    }

    widget.mount();

    mounted = true;

  }

  ensureMounted();

  const observer =
      new MutationObserver(() => {

        if (

            !document.querySelector(

                "[data-ews-root]"

            )

        ) {

          mounted = false;

          ensureMounted();

        }

      });

  observer.observe(document.body, {

    childList: true,

    subtree: true

  });

})(window);