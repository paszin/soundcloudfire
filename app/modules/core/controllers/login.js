'use strict';




/**
 * @ngdoc object
 * @name core.Controllers.LoginController
 * @description LoginController
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LoginController', [
        '$scope', '$state', '$stateParams', '$location', 'credentials', 'SoundCloudLogin', 'SoundCloudAPI',
        function ($scope, $state, $stateParams, $location, crendentials, SoundCloudLogin, SoundCloudAPI) {

                SoundCloudLogin.connect().then(function () {
                    console.log("connected");// Connected!
                    SoundCloudAPI.me();
                });
            


            //            
            //            SC.initialize({
            //                client_id: crendentials.client_id,
            //                redirect_uri: 'http://127.0.0.1:9000'
            //            });
            //
            //             SC.connect(function(response){
            //
            //                SC.get("/me", function(response){
            //                    console.log(response);
            //                    var data={};
            //                    data.token = SC.accessToken();
            //                    data.id = response.id;
            //                    $rootScope.user.sc_id=data.id;
            //                    $rootScope.user.sc_token=data.token;
            //                    soundcloud.saveToken(data);
            //                    soundcloud.generateAuthString();
            //
            //                    //other things
            //
            //        });
            //    });

            if ($state.is('login')) {
                $scope.text = 'login';

            }
            if ($state.is('loginsuccess')) {
                console.log('succesfully logged in');
                $scope.text = 'success';
            }


        }
]);