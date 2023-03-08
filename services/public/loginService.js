angular.module("app").factory("loginService", [
  "$http",
  "$rootScope",
  "$location",
  function ($http, $rootScope, $location) {
    return {
      authLogin: function (data) {
        return $http.post("http://localhost:5000/api/auth/login", data);
      },
      authLogout: function () {
        localStorage.removeItem("jwt-token");
        $rootScope.authUser = null;
        $rootScope.jwtToken = null;
        $rootScope.brandAdmins = null;
        $rootScope.brandUsers = null;
        $rootScope.projects = null;
        $rootScope.activeProject = null;
        $rootScope.users = null;
        $location.path("/login");
      },
    };
  },
]);
