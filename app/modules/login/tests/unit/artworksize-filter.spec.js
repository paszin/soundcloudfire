'use strict';

describe('Filter: Artworksize', function () {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('login'));

    var Artworksize;

    beforeEach(inject(function ($filter) {
        Artworksize = $filter('artworksize');
    }));

    it('should ...', function () {

    });

});
