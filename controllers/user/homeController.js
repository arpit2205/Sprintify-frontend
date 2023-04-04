app.controller("userHomeController", [
  "$scope",
  "$rootScope",
  "loginService",
  "toastService",
  function ($scope, $rootScope, loginService, toastService) {
    $scope.handleLogout = function () {
      loginService.authLogout();
      toastService.showToast("Logged out", "success", 3000);
    };
  },
]);
