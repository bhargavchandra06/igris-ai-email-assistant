(function attachDropdownCoordinator(global) {

  const registry = new Set();

  const coordinator = {
    register(dropdown) {
      registry.add(dropdown);
    },
    unregister(dropdown) {
      registry.delete(dropdown);
    },
    open(dropdown) {
      registry.forEach(instance => {
        if (instance !== dropdown) {
          instance.close({ fromCoordinator: true });
        }
      });
      dropdown.setOpenState(true);
    }
  };

  global.EmailAssistantDropdownCoordinator = coordinator;

})(window);
