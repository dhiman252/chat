/// <reference path="../../services/zmprofilegroupsservice.ts" />
/// <reference path="../../interfaces/zminterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var angularTask;
(function (angularTask) {
    (function (controllers) {
        var ProfileGroupsController = (function () {
            function ProfileGroupsController(profileGroupService) {
                var _this = this;
                this.getGroups = function () {
                    _this.groups = _this.ProfileGroupService.readListOfGroups();
                };
                this.ProfileGroupService = profileGroupService;
            }
            ProfileGroupsController.$inject = ["angularTask.Services.ProfileGroupService"];
            return ProfileGroupsController;
        })();
        controllers.ProfileGroupsController = ProfileGroupsController;

        angular.module("angularTask").controller("angularTask.controllers.ProfileGroupsController", ProfileGroupsController);
    })(angularTask.controllers || (angularTask.controllers = {}));
    var controllers = angularTask.controllers;
})(angularTask || (angularTask = {}));
//# sourceMappingURL=zmProfileGroupsController.js.map
