app.run([
  "$rootScope",
  "$location",
  "createUserService",
  function ($rootScope, $location, createUserService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/brand-admin/users") {
        //TODO: fetch admins
        createUserService
          .fetchUsers()
          .then(function (data) {
            $rootScope.brandUsers = data?.data?.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  },
]);

app.controller("adminHomeController", [
  "$scope",
  "$rootScope",
  "loginService",
  "createUserService",
  function ($scope, $rootScope, loginService, createUserService) {
    $scope.handleLogout = function () {
      loginService.authLogout();
    };

    $scope.handleCreateUser = function () {
      createUserService
        .createUser($scope.createUser)
        .then(function (data) {
          $rootScope.brandUsers.push(data.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  },
]);
