angular.module("app").factory("projectService", [
  "$http",
  function ($http) {
    return {
      fetchProjects: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          "http://localhost:5000/api/brand-user/projects/all-projects",
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
