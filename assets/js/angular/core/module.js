angular
  .module('coreModule', [
    'core.services',
    'associationMap.services'
  ]);

angular
  .module('core.services', []);

angular
  .module('associationMap.services', ['core.services']);