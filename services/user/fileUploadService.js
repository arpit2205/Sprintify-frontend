app.service("fileUpload", [
  "$http",
  "$rootScope",
  function ($http, $rootScope) {
    return {
      uploadFileToUrl: function (file, uploadUrl) {
        var fd = new FormData();
        fd.append("image", file);
        $http
          .post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
              "Content-Type": undefined,
              Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
            },
          })
          .then(function (data) {
            console.log(data);
            $rootScope.task.attachments = data.data.data.attachments;
          })
          .catch(function (err) {
            console.log(err);
          });
      },

      deleteFile: function (taskId, imageKey) {
        var jwtToken = localStorage.getItem("jwt-token");

        return $http.patch(
          "http://localhost:5000/api/brand-user/tasks/delete-attachment",
          {
            taskId: taskId,
            imageKey: imageKey,
          },
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
