app.run([
  "$rootScope",
  "$location",
  "projectService",
  "userService",
  "toastService",
  function ($rootScope, $location, projectService, userService, toastService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/user/projects") {
        // reset tasks
        $rootScope.activeProjectTasks = null;
        $rootScope.task = null;
        $rootScope.selectedSprint = null;
        $rootScope.paginationCount = null;
        $rootScope.paginationArray = null;
        $rootScope.projectMembers = null;

        // fetch projects
        projectService
          .fetchProjects()
          .then(function (data) {
            $rootScope.projects = data.data.data;
            console.log(data.data.data);
          })
          .catch(function (error) {
            console.log(error);
            toastService.showToast("Error fetching projects", "warning", 3000);
          });
      }
    });
  },
]);

app.controller("userProjectsController", [
  "$scope",
  "$rootScope",
  "$location",
  "loginService",
  "projectService",
  "userService",
  "utilService",
  "toastService",
  function (
    $scope,
    $rootScope,
    $location,
    loginService,
    projectService,
    userService,
    utilService,
    toastService
  ) {
    $scope.addProjectForm = false;
    $scope.selectedMembers = [];

    $scope.addProject = {
      title: "",
      description: "",
      status: "",
    };

    $scope.handleLogout = function () {
      loginService.authLogout();
      toastService.showToast("Logged out", "success", 3000);
    };

    $scope.addMembersChange = function () {
      if (!$scope.addProject.membersSearch) return;

      userService
        .fetchUsersByRegex($scope.addProject.membersSearch)
        .then(function (data) {
          $scope.results = data.data.data;
          console.log(data.data.data);
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

    // submit form
    $scope.handleCreateProject = function () {
      console.log($scope.addProject);

      if (
        !$scope.addProject.title ||
        !$scope.addProject.description ||
        !$scope.addProject.status
      ) {
        toastService.showToast("Please fill all fields", "warning", 3000);
        return;
      }

      var members = [];
      for (let i = 0; i < $scope.selectedMembers.length; i++) {
        members.push({
          userId: $scope.selectedMembers[i]._id.toString(),
          name: $scope.selectedMembers[i].name,
          email: $scope.selectedMembers[i].email,
          roles: $scope.selectedMembers[i].roles,
        });
      }

      var data = {
        title: $scope.addProject.title,
        description: $scope.addProject.description,
        status: $scope.addProject.status,
        members: members,
      };

      toastService.showToast("Creating new project", "info", 3000);

      projectService
        .createProject(data)
        .then(function (data) {
          $rootScope.projects.push(data.data.data);

          $scope.addProject.membersSearch = "";
          $scope.selectedMembers = [];

          $scope.addProjectForm = false;

          toastService.showToast(
            "New project created successfully",
            "success",
            3000
          );
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error creating new project", "warning", 3000);
        });
    };

    $scope.toggleAddProjectForm = function () {
      $scope.addProjectForm = !$scope.addProjectForm;
    };

    $scope.handleSelectProject = function (project) {
      $rootScope.activeProject = project;
      localStorage.setItem("project", JSON.stringify(project));
      $location.path("/user/backlog");
    };
  },
]);
