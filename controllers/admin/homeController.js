app.run([
  "$rootScope",
  "$location",
  "createUserService",
  "toastService",
  function ($rootScope, $location, createUserService, toastService) {
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
            toastService.showToast("Error fetching users", "warning", 3000);
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
  "toastService",
  function ($scope, $rootScope, loginService, createUserService, toastService) {
    $scope.handleLogout = function () {
      loginService.authLogout();
      toastService.showToast("Logged out", "success", 3000);
    };

    $scope.handleCreateUser = function () {
      // email check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($scope.createUser.email)) {
        toastService.showToast("Enter a valid email", "warning", 3000);
        return;
      }

      // pwd check
      if (
        !/^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}$/.test(
          $scope.createUser.password
        )
      ) {
        toastService.showToast("Enter a valid password", "warning", 3000);
        return;
      }

      toastService.showToast("Creating user, please wait", "info", 3000);

      createUserService
        .createUser($scope.createUser)
        .then(function (data) {
          toastService.showToast(
            "New user cerated successfully",
            "success",
            3000
          );

          $rootScope.brandUsers.push(data.data.data);
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error creating new user", "warning", 3000);
        });
    };
  },
]);
