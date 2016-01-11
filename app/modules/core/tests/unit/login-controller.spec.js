'use strict';

describe('Controller: LoginController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('core'));

    var LoginController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        LoginController = $controller('LoginController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
