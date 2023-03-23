angular.module("app").factory("userService", [
  "$http",
  function ($http) {
    return {
      fetchUsers: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          "http://localhost:5000/api/brand-user/users/all-users",
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
          `http://localhost:5000/api/brand-user/projects/users/${pattern}`,
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
