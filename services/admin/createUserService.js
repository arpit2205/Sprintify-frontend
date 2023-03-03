angular.module("app").factory("createUserService", [
  "$http",
  function ($http) {
    return {
      createUser: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          "http://localhost:5000/api/brand-admin/auth/register-brand-user",
          {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchUsers: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get("http://localhost:5000/api/brand-admin/users", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      },
    };
  },
]);
