angular
  .module('coreModule', [
    'core.services',
    'pubmed.services',
    'associationMap.services',
    'argument.services'
  ]);

angular
  .module('core.services', []);

angular
  .module('pubmed.services', []);  

angular
  .module('associationMap.services', ['core.services']);

angular
  .module('argument.services', ['core.services']);