app.run([
  "$rootScope",
  "$location",
  "$stateParams",
  "taskService",
  function ($rootScope, $location, $stateParams, taskService) {
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

        $rootScope.projectUsers = JSON.parse(
          localStorage.getItem("project")
        ).members;

        var parts = $location.path().split("/");
        var taskId = parts[parts.indexOf("backlog") + 1];
        $rootScope.taskId = taskId;

        // fetch task details
        taskService
          .fetchSingleTask(taskId)
          .then(function (data) {
            $rootScope.task = data.data.data;

            // fetch task comments
            taskService
              .fetchComments($rootScope.task._id)
              .then(function (data) {
                $rootScope.comments = data.data.data;
              })
              .catch(function (error) {
                console.log(error);
              });

            // fetch task logs
            taskService
              .fetchLogs($rootScope.task._id)
              .then(function (data) {
                $rootScope.taskLogs = data.data.data;
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
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
  function (
    $scope,
    $rootScope,
    $location,
    $stateParams,
    taskService,
    $http,
    fileUpload
  ) {
    $scope.handleEditTaskSave = function () {
      if ($scope.editTask.assignedTo) {
        if ($scope.editTask.assignedTo !== "unassign") {
          var user = JSON.parse($scope.editTask.assignedTo);
          var assignedTo = {
            userId: user.memberId,
            name: user.name,
            email: user.email,
            roles: user.roles,
          };
          $scope.editTask.assignedTo = assignedTo;
        }
      }

      taskService
        .updateTaskDetails($rootScope.taskId, $scope.editTask)
        .then(function (data) {
          $rootScope.task = data.data.data;
          console.log(data.data.data);

          $scope.editTask.assignedTo = null;
          $scope.editTask.description = null;
          $scope.editTask.type = null;
          $scope.editTask.priority = null;
          $scope.editTask.status = null;
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleDeleteTask = function () {
      taskService
        .deleteTask($rootScope.taskId)
        .then(function (data) {
          console.log(data.data.data);

          $rootScope.task = null;
          $rootScope.taskId = null;

          $location.path("/user/backlog");
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handlePickTask = function () {
      taskService
        .pickTask($rootScope.taskId)
        .then(function (data) {
          console.log(data.data.data);
          $rootScope.task = data.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleAddComment = function () {
      if (!$scope.commentText) {
        return;
      }
      console.log($scope.commentText);
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

      taskService
        .createComment(data)
        .then(function (data) {
          $rootScope.comments.unshift(data.data.data);
          $scope.commentText = null;
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleDeleteComment = function (comment) {
      taskService
        .deleteComment(comment._id)
        .then(function (data) {
          var index = $rootScope.comments.indexOf(comment);
          $rootScope.comments.splice(index, 1);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleFileUpload = function () {
      var file = $scope.myFile;

      if (!$scope.myFile) {
        return;
      }

      var uploadUrl = `http://localhost:5000/api/brand-user/tasks/upload-attachment/${$rootScope.task._id}`;

      fileUpload.uploadFileToUrl(file, uploadUrl);
    };

    $scope.handleDeleteAttachment = function (image) {
      fileUpload
        .deleteFile($rootScope.task._id, image.key)
        .then(function (data) {
          $rootScope.task.attachments = data.data.data.attachments;
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  },
]);
