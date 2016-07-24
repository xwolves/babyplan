(function() {
  "use strict";
  angular.module('AboutCtrl', [])
  .controller('AboutCtrl', function ($scope,Env) {
      $scope.title=Env.AppName;
      $scope.version=Env.AppVersion;
  });
}());
