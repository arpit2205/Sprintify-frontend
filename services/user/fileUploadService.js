app.service("fileUpload", [
  "$http",
  "$rootScope",
  "toastService",
  function ($http, $rootScope, toastService) {
    return {
      uploadFileToUrl: function (file, uploadUrl) {
        var fd = new FormData();
        fd.append("image", file);
        toastService.showToast("Uploading file, please wait", "info", 3000);
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
            toastService.showToast(
              "File uploaded successfully",
              "success",
              3000
            );
            $rootScope.task.attachments = data.data.data.attachments;
          })
          .catch(function (err) {
            console.log(err);
            toastService.showToast("Error uploading file", "warning", 3000);
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
