'use strict';

function result(fixture) {
	return JSON.stringify(__fixtures__[fixture]);
}

function escape(value) {
	return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}

function EqualData() {
	jasmine.addMatchers({
		toEqualData : function() {
			return {
				compare : function(actual, expected) {
					return {
						pass : angular.equals(actual, expected)
					}
				}
			}
		}
	});
}

function httpd() {
	return function($httpBackend) {
		//respond ok
        $httpBackend.whenGET('/form').respond(result('form/form_ok'));
	}
}