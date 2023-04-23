angular.module("app").factory("taskService", [
  "$http",
  "$rootScope",
  "$q",
  function ($http, $rootScope, $q) {
    return {
      fetchTasks: function (page, limit, filters) {
        var jwtToken = localStorage.getItem("jwt-token");

        return $http.get(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/project/${$rootScope.activeProject._id.toString()}?page=${page}&limit=${limit}&text=${
            filters?.text
          }&type=${filters?.type}&status=${filters?.status}&priority=${
            filters?.priority
          }&sprint=${filters?.sprint || $rootScope.selectedSprint}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      createTask: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          "https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/create-task",
          data,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchSingleTask: function (taskId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchProjectMembers: function (projectId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/users/project-members/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      updateTaskDetails: function (taskId, data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.patch(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/edit/${taskId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      deleteTask: function (taskId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.delete(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/delete/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      pickTask: function (taskId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.patch(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/pick-task/${taskId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      createComment: function (data) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.post(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/comments/add-comment`,
          data,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchComments: function (taskId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/comments/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      deleteComment: function (commentId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.delete(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/comments/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      fetchLogs: function (taskId) {
        var jwtToken = localStorage.getItem("jwt-token");
        return $http.get(
          `https://curious-coveralls-ant.cyclic.app/api/brand-user/tasks/logs/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      },

      uniqueId: function () {
        var result = "";
        var characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < 4; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      },
    };
  },
]);
