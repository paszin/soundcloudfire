'use strict';

describe('Controller: PlaylistController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('core'));

    var PlaylistController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        PlaylistController = $controller('PlaylistController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
