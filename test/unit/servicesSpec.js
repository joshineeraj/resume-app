'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('restangular'));
  beforeEach(module('myApp.services'));
  beforeEach(module('facebook'));

  describe('usersService', function() {
    it('should get login success', inject(function(usersService, Facebook, $httpBackend) {
    	//$httpBackend.expect('GET', 'http://localhost:3000/users').respond(200,"Done");
    	
    	$httpBackend.expect('POST', 'http://localhost:3000/user_login',
    						{email:'nj@gmail.com',
							password:'11111111'})
    	.respond(200, "{ \
		    	  'name': 'Neeraj Joshi', \
		    	  'email': 'nj@gmail.com', \
		    	  'username': 'neeraj', \
		    	  'password': '11111111', \
		    	  'password2': '11111111', \
		    	  '_id': '530c67b6ea1df04b22496708' \
		    	}");
    	usersService.chkLogin({'email':'nj@gmail.com',
					'password':'11111111'})
		.then(function(data) {
			console.log(data);
			expect(data.success).toBeTruthy();
		});
    }));
  });
});


