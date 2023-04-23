angular.module("app").factory("userService", [
  "$http",
  function ($http) {
    return {
      fetchUsers: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          "https://curious-coveralls-ant.cyclic.app/api/brand-user/users/all-users",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchUsersByRegex: function (pattern) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/projects/users/${pattern}`,
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
