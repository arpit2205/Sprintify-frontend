angular.module("app").factory("resetPasswordService", [
  "$http",
  function ($http) {
    return {
      resetPwd: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          "https://curious-coveralls-ant.cyclic.app/api/super-admin/auth/reset-password",
          {
            currentPassword: data.current,
            newPassword: data.new,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },
    };
  },
]);
