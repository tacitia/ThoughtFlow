angular
  .module('v2Module', [
    'v2.controllers',
    'explore.v2.controllers',
    'focus.v2.controllers',
    'termTopic.services',
    'ngAnimate', 
    'ui.bootstrap'
  ]);

angular
  .module('v2.controllers', ['modalModule']);

angular
  .module('explore.v2.controllers', ['angularFileUpload', 'ui.select', 'ngSanitize']);

angular
  .module('focus.v2.controllers', ['angularFileUpload']);

angular
  .module('termTopic.services', []);