app.run([
  "$rootScope",
  "$location",
  "taskService",
  "toastService",
  function ($rootScope, $location, taskService, toastService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/user/settings") {
        $rootScope.task = null;
        $rootScope.comments = null;
        $rootScope.taskLogs = null;

        var project =
          $rootScope.activeProject ||
          JSON.parse(localStorage.getItem("project"));

        if (!project) {
          $location.path("/user/projects");
          return;
        }

        $rootScope.activeProject = project;

        // fetch project members (to assign tasks)
        taskService
          .fetchProjectMembers($rootScope.activeProject._id)
          .then(function (data) {
            $rootScope.projectMembers = data.data.data;
            console.log("members:", data.data.data);
          })
          .catch(function (error) {
            console.log(error);
            toastService.showToast(
              "Error fetching project members",
              "warning",
              3000
            );
          });
      }
    });
  },
]);

app.controller("userSettingsController", [
  "$scope",
  "$rootScope",
  "$location",
  "projectService",
  "userService",
  "toastService",
  function (
    $scope,
    $rootScope,
    $location,
    projectService,
    userService,
    toastService
  ) {
    $scope.selectedMembers = [];

    $scope.handleEditProject = function () {
      if (
        !$scope.editProject.title &&
        !$scope.editProject.description &&
        !$scope.editProject.status
      ) {
        toastService.showToast("Make at least one change", "info", 3000);
        return;
      }
      toastService.showToast("Updating project details", "info", 3000);

      projectService
        .editProjectDetails($scope.editProject)
        .then(function (data) {
          console.log(data.data.data);
          toastService.showToast(
            "Project details updated successfully",
            "success",
            3000
          );
          $rootScope.activeProject = data.data.data;
          localStorage.removeItem("project");
          localStorage.setItem("project", JSON.stringify(data.data.data));
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast(
            "Error updating project details",
            "warning",
            3000
          );
        });
    };

    // add members logic

    $scope.addMembersChange = function () {
      if (!$scope.editProject.membersSearch) return;

      userService
        .fetchUsersByRegex($scope.editProject.membersSearch)
        .then(function (data) {
          var users = data.data.data;
          $scope.results = [];

          var projectMembersIds = [];
          for (var i = 0; i < $rootScope.projectMembers.length; i++) {
            projectMembersIds.push($rootScope.projectMembers[i].userId);
          }

          for (var i = 0; i < users.length; i++) {
            if (projectMembersIds.indexOf(users[i]._id.toString()) === -1) {
              $scope.results.push(users[i]);
            }
          }

          console.log($scope.results);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleSelectMember = function (user) {
      var found = false;
      for (var i = 0; i < $scope.selectedMembers.length; i++) {
        if (user.email === $scope.selectedMembers[i].email) {
          found = true;
          break;
        }
      }

      if (!found) {
        $scope.selectedMembers.push(user);
      }
    };

    $scope.handleRemoveSelectedMember = function (user) {
      var index = $scope.selectedMembers.indexOf(user);
      if (index !== -1) {
        $scope.selectedMembers.splice(index, 1);
      }
    };

    // ends

    $scope.handleInviteMembers = function () {
      if ($scope.selectedMembers.length === 0) {
        toastService.showToast(
          "Select at least one member to invite",
          "info",
          3000
        );
        return;
      }

      var users = [];

      for (var i = 0; i < $scope.selectedMembers.length; i++) {
        users.push({
          userId: $scope.selectedMembers[i]._id,
          name: $scope.selectedMembers[i].name,
          email: $scope.selectedMembers[i].email,
          roles: $scope.selectedMembers[i].roles,
        });
      }

      toastService.showToast(
        "Adding selected members to this project",
        "info",
        3000
      );

      projectService
        .addProjectMembers({ members: users })
        .then(function (data) {
          $scope.results = [];
          $scope.selectedMembers = [];

          toastService.showToast(
            "Selected members added to this project successfully",
            "success",
            3000
          );

          var users = data.data.data;

          for (var i = 0; i < users.length; i++) {
            $rootScope.projectMembers.push(users[i].user);
          }
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error selecting members", "warning", 3000);
        });
    };

    $scope.handleRemoveUserAccess = function (user) {
      var index = $scope.projectMembers.indexOf(user);

      if (index === -1) {
        return;
      }

      toastService.showToast(
        `Removing ${user.name} from this project`,
        "info",
        3000
      );

      projectService
        .removeMemberFromProject(user)
        .then(function (data) {
          console.log(data.data.data);
          $scope.projectMembers.splice(index, 1);
          toastService.showToast(
            `${user.name} was removed from this project successfully`,
            "success",
            3000
          );
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast(`Error removing user`, "success", 3000);
        });
    };

    $scope.handleDeleteProject = function () {
      toastService.showToast(
        `Initiating project delete, this may take some time`,
        "info",
        3000
      );
      projectService
        .deleteProject()
        .then(function (data) {
          console.log(data.data.data);
          toastService.showToast(
            `Project deleted successfully`,
            "success",
            3000
          );
          $location.path("/user/projects");
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast(`Error deleting project`, "warning", 3000);
        });
    };
  },
]);
