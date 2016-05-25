(function () {
    'use strict';

    angular
        .module('zmApp')
        .factory('zmGroupListingService',zmGroupListingService);

    function zmGroupListingService($http, $q, $log){
        return ({
            getData: function(){
                // The timeout property of the http request takes a deferred value
                // that will abort the underying AJAX request if / when the deferred
                // value is resolved.
                var deferredAbort = $q.defer();

                // Initiate the AJAX request.
                var request = $http({
                    url: 'groups.json',
                    timeout: deferredAbort.promise
                });

                // Rather than returning the http-promise object, we want to pipe it
                // through another promise so that we can "unwrap" the response
                // without letting the http-transport mechansim leak out of the
                // service layer.
                var promise = request.then(
                    function( response ) {
                        return( response.data );
                    },
                    function( response ) {
                        return( $q.reject( "Something went wrong" ) );
                    }
                );

                // Now that we have the promise that we're going to return to the
                // calling context, let's augment it with the abort method. Since
                // the $http service uses a deferred value for the timeout, then
                // all we have to do here is resolve the value and AngularJS will
                // abort the underlying AJAX request.
                promise.abort = function() {
                    deferredAbort.resolve();
                };

                // Since we're creating functions and passing them out of scope,
                // we're creating object references that may be hard to garbage
                // collect. As such, we can perform some clean-up once we know
                // that the requests has finished.
                promise.finally(
                    function() {
                        //console.info( "Cleaning up object references." );
                        promise.abort = angular.noop;
                        deferredAbort = request = promise = null;
                    }
                );

                return( promise );
            }
        });
    }
})();