app.controller("loginController", [
  "$rootScope",
  "$scope",
  "$location",
  "loginService",
  "toastService",
  function ($rootScope, $scope, $location, loginService, toastService) {
    $scope.handleLogin = function () {
      $scope.login.error = "";

      toastService.showToast("Logging in, please wait", "info", 3000);

      loginService
        .authLogin($scope.login)
        .then(function (data) {
          toastService.showToast("Login successful", "success", 3000);

          $scope.login.error = "";

          var authUser = data.data.data.user;
          $rootScope.authUser = authUser;

          var jwtToken = data.data.data.token;
          $rootScope.jwtToken = jwtToken;

          localStorage.setItem("jwt-token", data.data.data.token);

          // is user is superadmin
          if (authUser.isSuperAdmin) {
            if (authUser.didPasswordReset) {
              $location.path("/super-admin/admins");
              return;
            }
            $location.path("/super-admin/reset-password");
            return;
          }

          // is user is brand admin
          if (authUser.isBrandAdmin) {
            $location.path("/brand-admin/users");
            return;
          }

          // is user is brand user
          if (authUser.isBrandUser) {
            $location.path("/user/projects");
            return;
          }
        })
        .catch(function (error) {
          $scope.login.error = error.data.data;
          toastService.showToast("Error logging in", "warning", 3000);
        });
    };
  },
]);
