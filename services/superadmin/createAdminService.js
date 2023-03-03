angular.module("app").factory("createAdminService", [
  "$http",
  function ($http) {
    return {
      createBrand: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          "http://localhost:5000/api/super-admin/auth/register-brand",
          {
            name: data.brandName,
            logoUrl: data.logoUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      createAdmin: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          "http://localhost:5000/api/super-admin/auth/register-brand-admin",
          {
            name: data.data.name,
            email: data.data.email,
            password: data.data.password,
            brand: {
              name: data.data.brandName,
              logoUrl: data.data.logoUrl,
              brandId: data.brandId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchAdmins: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          "http://localhost:5000/api/super-admin/brand-admins",

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
