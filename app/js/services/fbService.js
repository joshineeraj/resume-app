'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a FB service.
angular.module('myApp.fbService', []).
  value('version', '0.1')
.service("FbService", function(Facebook){
	var _intentLogin = function() {
		var login_status = Facebook.getLoginStatus(function(response) {
			return response
		});
		return login_status;
	};
    var _fblogin = function() {
    	var connect_status = Facebook.login(function(response) {
    		if (response.status == 'connected') {
    			return response
    		}
    	}, { scope: 'email' });
    	return connect_status;
    };
      
    var _me = function() {
        var logged_in_person = Facebook.api('/me', function(response) {
            return response
        });
        return logged_in_person;
    };

    var _my_pic = function() {
        var logged_in_person_pic = Facebook.api('/me/picture/?type=normal', function(response) {
            return response
            });
        return logged_in_person_pic;
    };
     var _logout = function(){
    	 var fb_logout = Facebook.logout(function(response) {
	    	  return response
    	 });
    	 return fb_logout;
     }

    return{
        me: _me,
        my_pic: _my_pic,
        intentLogin: _intentLogin,
        fblogin: _fblogin,
        logout: _logout
    };
});



