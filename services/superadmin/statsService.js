angular.module("app").factory("superadminStatsService", [
  "$http",
  function ($http) {
    return {
      fetchNumericStats: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(`http://localhost:5000/api/super-admin/stats/counts`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      },

      fetchBrandWiseStats: function (brandId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `http://localhost:5000/api/super-admin/stats/brand/${brandId}`,
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
