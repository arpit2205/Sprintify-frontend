angular.module("app").factory("sprintService", [
  "$http",
  "$rootScope",
  function ($http, $rootScope) {
    return {
      createSprint: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          "http://localhost:5000/api/brand-user/sprints/create-sprint",
          data,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchSprints: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        var project = $rootScope.activeProject;
        return $http.get(
          `http://localhost:5000/api/brand-user/sprints/project/${project._id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchSprintStatus: function (projectId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `http://localhost:5000/api/brand-user/sprints/status/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      addTasksToSprint: function (sprint, taskIdsToBeUpdated) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          `http://localhost:5000/api/brand-user/sprints/add-tasks`,
          {
            taskIdsToBeUpdated: taskIdsToBeUpdated,
            sprint: sprint,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      startSprint: function (sprintId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.patch(
          `http://localhost:5000/api/brand-user/sprints/start/${sprintId}`,
          null,
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
