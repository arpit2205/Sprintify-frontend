app.run([
  "$rootScope",
  "$location",
  "createAdminService",
  "toastService",
  function ($rootScope, $location, createAdminService, toastService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/super-admin/admins") {
        //TODO: fetch admins
        createAdminService
          .fetchAdmins()
          .then(function (data) {
            $rootScope.brandAdmins = data?.data?.data;
          })
          .catch(function (error) {
            console.log(error);
            toastService.showToast("Error fetching admins", "warning", 3000);
          });
      }
    });
  },
]);

app.controller("superadminHomeController", [
  "$scope",
  "$rootScope",
  "$location",
  "createAdminService",
  "loginService",
  "toastService",
  function (
    $scope,
    $rootScope,
    $location,
    createAdminService,
    loginService,
    toastService
  ) {
    $scope.handleLogout = function () {
      loginService.authLogout();
      toastService.showToast("Logged out", "success", 3000);
    };

    $scope.handleCreateAdmin = function () {
      // email check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($scope.createAdmin.email)) {
        toastService.showToast("Enter a valid email", "warning", 3000);
        return;
      }

      // pwd check
      if (
        !/^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}$/.test(
          $scope.createAdmin.password
        )
      ) {
        toastService.showToast("Enter a valid password", "warning", 3000);
        return;
      }

      toastService.showToast("Creating a new brand", "info", 3000);

      createAdminService
        .createBrand($scope.createAdmin)
        .then(function (data) {
          toastService.showToast("New brand created", "success", 3000);
          toastService.showToast("Creating new admin", "info", 3000);

          // create admin
          createAdminService
            .createAdmin({
              data: $scope.createAdmin,
              brandId: data.data.data._id,
            })
            .then(function (data) {
              toastService.showToast("Brand admin created", "success", 3000);

              $rootScope.brandAdmins.push(data.data.data);
            });
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error creating brand admin", "warning", 3000);
        });
    };
  },
]);
