angular.module("app").factory("projectService", [
  "$http",
  "$rootScope",
  function ($http, $rootScope) {
    return {
      fetchProjects: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          "https://curious-coveralls-ant.cyclic.app/api/brand-user/projects/all-projects",
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
          "https://curious-coveralls-ant.cyclic.app/api/brand-user/projects/create-project",
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
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/projects/edit-details/${$rootScope.activeProject._id}`,
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
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/projects/add-members/${$rootScope.activeProject._id}`,
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
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/projects/remove-member/${$rootScope.activeProject._id}/${data.userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      deleteProject: function () {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.delete(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/projects/delete-project/${$rootScope.activeProject._id}`,
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
