app.controller("userHomeController", [
  "$scope",
  "$rootScope",
  "loginService",
  function ($scope, $rootScope, loginService) {
    $scope.handleLogout = function () {
      loginService.authLogout();
    };
  },
]);
