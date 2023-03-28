angular.module("app").factory("userStatsService", [
  "$http",
  function ($http) {
    return {
      fetchWeeklyTaskDigestData: function (projectId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `http://localhost:5000/api/brand-user/tasks/weekly-chart/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchSprintStats: function (projectId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `http://localhost:5000/api/brand-user/sprints/stats/${projectId}`,
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
