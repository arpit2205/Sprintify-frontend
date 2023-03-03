app.controller("loginController", [
  "$rootScope",
  "$scope",
  "$location",
  "loginService",
  function ($rootScope, $scope, $location, loginService) {
    $scope.handleLogin = function () {
      $scope.login.error = "";

      loginService
        .authLogin($scope.login)
        .then(function (data) {
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
        });
    };
  },
]);
