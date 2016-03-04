angular
  .module('coreModule', [
    'core.services',
    'pubmed.services',
    'associationMap.services',
    'argument.services',
    'paper.services',
    'collection.services',
    'user.services',
    'exploreState.services',
  ]);

angular
  .module('core.services', []);

angular
  .module('pubmed.services', []);  

angular
  .module('associationMap.services', ['core.services']);

angular
  .module('argument.services', ['core.services']);

angular
  .module('paper.services', ['core.services']);

angular
  .module('collection.services', ['core.services']);

angular
  .module('user.services', ['core.services']);

angular
  .module('exploreState.services', ['exploreState.services']);
