(function () {
    'use strict';

    angular
        .module('zmApp')
        .component('zmProfileGroups', {
        templateUrl: 'components/zm-profile-groups/zm-profile-groups.template.html',
        controller: ['$log','zmGroupListingService',
            function ProfileGroupsController($log,zmGroupListingService) {
                var self = this;
                self.groups = zmGroupListingService
                    .getData()
                    .then(
                        function(response) {
                            $log.info(response);
                            return self.groups = response.data;
                        },
                        function( errorMessage ) {
                            $log.info(errorMessage);
                            return self.groups = [];
                        }
                    );
            }
        ]
    });

})();