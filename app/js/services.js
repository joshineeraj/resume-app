'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1')
  .factory("usersService", function($http, Restangular, $q, $timeout){

    var _getUsers = function(){
        var deferred = $q.defer();
        Restangular.all('users').getList().then(function (data) {
                    var user_data = data;
                    $timeout(function() {
                        deferred.resolve(user_data);
                        }, 1000);
                });
                return deferred.promise;
    }
    
    var _addNewUser = function(newUser){
    	var user = Restangular.all('users').post(newUser);
    	return user;
    }
	
    var _fetchUser = function(user){
    	var originalUser =  Restangular.one('users', user.id).get();
    	var fetchUser = Restangular.copy(originalUser);
    	return fetchUser;
    }
	
    var _removeUser = function(user){
    	var originalUser =  Restangular.one('users', user.id).get();
    	return originalUser;
    }

    var _getResumeDetails = function(newUser){
        var originalUser = Restangular.all('users').post(newUser);
        return originalUser;
    }
	var _chkLogin = function(user){
    	var userInfo = {email : user.email, password : user.password}
    	var user = Restangular.all('user_login').post(userInfo);
    	return user;
    }
	var _chkemailid = function(user_email){
    	var userInfo = {email : user_email}
    	var user = Restangular.all('validate_email').post(userInfo);
		return user;
    }
	
	

    return{
        getUsers: _getUsers,
        addNewUser: _addNewUser,
        fetchUser: _fetchUser,
        removeUser:_removeUser,
        getResumeDetails:_getResumeDetails,
		chkLogin:_chkLogin,
		chkemailid : _chkemailid
    };
})

.factory("FbService", function(Facebook){

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

    return{
        me: _me,
        my_pic: _my_pic
    };
});



