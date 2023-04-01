angular.module("app").factory("adminStatsService", [
  "$http",
  function ($http) {
    return {
      fetchNumericStats: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(`http://localhost:5000/api/brand-admin/stats/counts`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      },
    };
  },
]);
