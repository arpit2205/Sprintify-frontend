angular.module("app").factory("projectService", [
  "$http",
  "$rootScope",
  function ($http, $rootScope) {
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

      createProject: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          "http://localhost:5000/api/brand-user/projects/create-project",
          data,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      editProjectDetails: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.patch(
          `http://localhost:5000/api/brand-user/projects/edit-details/${$rootScope.activeProject._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      addProjectMembers: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          `http://localhost:5000/api/brand-user/projects/add-members/${$rootScope.activeProject._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      removeMemberFromProject: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.delete(
          `http://localhost:5000/api/brand-user/projects/remove-member/${$rootScope.activeProject._id}/${data.userId}`,
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
