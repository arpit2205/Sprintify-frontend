app.run([
  "$rootScope",
  "$location",
  "createAdminService",
  function ($rootScope, $location, createAdminService) {
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
  function ($scope, $rootScope, $location, createAdminService, loginService) {
    $scope.handleLogout = function () {
      loginService.authLogout();
    };

    $scope.handleCreateAdmin = function () {
      createAdminService
        .createBrand($scope.createAdmin)
        .then(function (data) {
          console.log("Brand created");

          // create admin
          createAdminService
            .createAdmin({
              data: $scope.createAdmin,
              brandId: data.data.data._id,
            })
            .then(function (data) {
              console.log("Admin created");
              $rootScope.brandAdmins.push(data.data.data);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  },
]);
