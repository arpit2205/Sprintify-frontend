app.controller("resetPasswordController", [
  "$scope",
  "$location",
  "resetPasswordService",
  function ($scope, $location, resetPasswordService) {
    $scope.handleResetPassword = function () {
      $scope.password.error = "";
      resetPasswordService
        .resetPwd($scope.password)
        .then(function (data) {
          $scope.password.error = "";
          $location.path("/super-admin/admins");
        })
        .catch(function (error) {
          console.log(error);
          $scope.password.error = error.data?.data;
        });
    };
  },
]);
