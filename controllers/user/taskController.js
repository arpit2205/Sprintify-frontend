app.run([
  "$rootScope",
  "$location",
  "$stateParams",
  "taskService",
  "toastService",
  function ($rootScope, $location, $stateParams, taskService, toastService) {
    $rootScope.$on("$locationChangeSuccess", function () {
      var regex = /^\/user\/backlog\/\w+$/;
      if (regex.test($location.path())) {
        // set users so that tasks can be assigned
        if (!localStorage.getItem("project")) {
          $location.path("/user/projects");
          return;
        }

        $rootScope.activeProject =
          $rootScope.activeProject ||
          JSON.parse(localStorage.getItem("project"));

        // $rootScope.projectUsers = JSON.parse(
        //   localStorage.getItem("project")
        // ).members;

        var parts = $location.path().split("/");
        var taskId = parts[parts.indexOf("backlog") + 1];
        $rootScope.taskId = taskId;

        // fetch task details
        taskService
          .fetchSingleTask(taskId)
          .then(function (data) {
            $rootScope.task = data.data.data;

            // fetch project members (to assign tasks)
            taskService
              .fetchProjectMembers($rootScope.activeProject._id)
              .then(function (data) {
                $rootScope.projectMembers = data.data.data;
              })
              .catch(function (error) {
                console.log(error);
                toastService.showToast(
                  "Error fetching project members",
                  "warning",
                  3000
                );
              });

            // fetch task comments
            taskService
              .fetchComments($rootScope.task._id)
              .then(function (data) {
                $rootScope.comments = data.data.data;
              })
              .catch(function (error) {
                console.log(error);
                toastService.showToast(
                  "Error fetching project comments",
                  "warning",
                  3000
                );
              });

            // fetch task logs
            taskService
              .fetchLogs($rootScope.task._id)
              .then(function (data) {
                $rootScope.taskLogs = data.data.data;
              })
              .catch(function (error) {
                console.log(error);
                toastService.showToast(
                  "Error fetching project logs",
                  "warning",
                  3000
                );
              });
          })
          .catch(function (error) {
            console.log(error);
            toastService.showToast(
              "Error fetching task details",
              "warning",
              3000
            );
          });
      }
    });
  },
]);

// file upload directive
app.directive("fileModel", [
  "$parse",
  function ($parse) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        element.bind("change", function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  },
]);

///////

app.controller("userTaskController", [
  "$scope",
  "$rootScope",
  "$location",
  "$stateParams",
  "taskService",
  "$http",
  "fileUpload",
  "toastService",
  function (
    $scope,
    $rootScope,
    $location,
    $stateParams,
    taskService,
    $http,
    fileUpload,
    toastService
  ) {
    $scope.handleEditTaskSave = function () {
      if ($scope.editTask.assignedTo) {
        if ($scope.editTask.assignedTo !== "unassign") {
          var user = JSON.parse($scope.editTask.assignedTo);
          var assignedTo = {
            userId: user.userId,
            name: user.name,
            email: user.email,
            roles: user.roles,
          };
          $scope.editTask.assignedTo = assignedTo;
        }
      }

      if (
        !$scope.editTask.type &&
        !$scope.editTask.priority &&
        !$scope.editTask.status &&
        !$scope.editTask.assignedTo &&
        !$scope.editTask.description
      ) {
        toastService.showToast("Select at least one change", "info", 3000);
      }

      toastService.showToast("Updating task details", "info", 3000);

      taskService
        .updateTaskDetails($rootScope.taskId, $scope.editTask)
        .then(function (data) {
          $rootScope.task = data.data.data;
          console.log(data.data.data);
          toastService.showToast(
            "Task details updated successfully",
            "success",
            3000
          );

          $scope.editTask.assignedTo = null;
          $scope.editTask.description = null;
          $scope.editTask.type = null;
          $scope.editTask.priority = null;
          $scope.editTask.status = null;
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast(
            "Error updating task details",
            "warning",
            3000
          );
        });
    };

    $scope.handleDeleteTask = function () {
      toastService.showToast("Deleting task", "info", 3000);
      taskService
        .deleteTask($rootScope.taskId)
        .then(function (data) {
          console.log(data.data.data);

          toastService.showToast("Task deleted successfully", "success", 3000);

          $rootScope.task = null;
          $rootScope.taskId = null;

          $location.path("/user/backlog");
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error deleting task", "warning", 3000);
        });
    };

    $scope.handlePickTask = function () {
      toastService.showToast("Assigning this task to you", "info", 3000);
      taskService
        .pickTask($rootScope.taskId)
        .then(function (data) {
          console.log(data.data.data);
          toastService.showToast("Task assigned to you", "success", 3000);
          $rootScope.task = data.data.data;
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error assigning task", "warning", 3000);
        });
    };

    $scope.handleAddComment = function () {
      if (!$scope.commentText) {
        toastService.showToast("Enter some text", "info", 3000);
        return;
      }

      var data = {
        task: {
          taskId: $rootScope.task._id,
          title: $rootScope.task.title,
        },
        project: {
          projectId: $rootScope.activeProject._id,
          title: $rootScope.activeProject.title,
        },
        text: $scope.commentText,
      };

      toastService.showToast("Posting comment", "info", 3000);

      taskService
        .createComment(data)
        .then(function (data) {
          $rootScope.comments.unshift(data.data.data);
          $scope.commentText = null;
          toastService.showToast(
            "Comment posted successfully",
            "success",
            3000
          );
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error posting comment", "warning", 3000);
        });
    };

    $scope.handleDeleteComment = function (comment) {
      toastService.showToast("Deleting comment", "info", 3000);
      taskService
        .deleteComment(comment._id)
        .then(function (data) {
          var index = $rootScope.comments.indexOf(comment);
          $rootScope.comments.splice(index, 1);
          toastService.showToast(
            "Comment deleted successfully",
            "success",
            3000
          );
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error deleting comment", "warning", 3000);
        });
    };

    $scope.handleFileUpload = function () {
      var file = $scope.myFile;

      if (!$scope.myFile) {
        toastService.showToast("Select a file first", "info", 3000);
        return;
      }

      var uploadUrl = `http://localhost:5000/api/brand-user/tasks/upload-attachment/${$rootScope.task._id}`;

      fileUpload.uploadFileToUrl(file, uploadUrl);
    };

    $scope.handleDeleteAttachment = function (image) {
      toastService.showToast("Deleting file", "info", 3000);
      fileUpload
        .deleteFile($rootScope.task._id, image.key)
        .then(function (data) {
          $rootScope.task.attachments = data.data.data.attachments;
          toastService.showToast("File deleted successfully", "success", 3000);
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error deleting file", "warning", 3000);
        });
    };
  },
]);
