angular.module("app").factory("adminStatsService", [
  "$http",
  function ($http) {
    return {
      fetchNumericStats: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `https://curious-coveralls-ant.cyclic.app/api/brand-admin/stats/counts`,
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
