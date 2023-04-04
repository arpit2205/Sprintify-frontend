app.controller("resetPasswordController", [
  "$scope",
  "$location",
  "resetPasswordService",
  "toastService",
  function ($scope, $location, resetPasswordService, toastService) {
    $scope.handleResetPassword = function () {
      $scope.password.error = "";
      toastService.showToast("Resetting password, please wait", "info", 3000);

      resetPasswordService
        .resetPwd($scope.password)
        .then(function (data) {
          $scope.password.error = "";
          $location.path("/super-admin/admins");
          toastService.showToast("Password reset successful", "success", 3000);
        })
        .catch(function (error) {
          console.log(error);
          $scope.password.error = error.data?.data;
          toastService.showToast("Error reseting password", "warning", 3000);
        });
    };
  },
]);
