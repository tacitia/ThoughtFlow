angular
  .module('focusModule', [
    'focus.controllers',
    'angularFileUpload'
  ]);

angular
  .module('focus.controllers', ['angularFileUpload', 'modalModule']);