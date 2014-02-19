'use strict';


angular.module('myApp.entity', []).
factory('genders', function(){
	var _gender = [{value:'Male', text:'Male'}, 
				  {value:'Female', text:'Female'}];	
	return{gender: _gender};
})
//.factory('newUsers', function(){
//	var _newUser = function(users){
//		var name = users.name || '';
//		var email = users.email || '';
//		var qualification = users.qualification || '';
//		var mobile = users.mobile || '';
//		var skills = users.skills || '';
//		var location = users.location || '';
//		var year_passing = users.year_passing || '';
//		var gender = users.gender || '';
//		var current_employer = users.current_employer || '';	
//	}
//	return{newUser:_newUser};
//});
.factory('newUsers', function(){
	var _newUser = function(users){
		var user = {
			"name": users.name || '',
			"email": users.email || '',
			"qualification": users.qualification || '',
			"mobile": users.mobile || '',
			"skills": users.skills || '',
			"location": users.location.name || '',
			"year_passing": users.year_passing || '',
			"gender": users.gender || '',
			"current_employer": ('work' in users) ? users.work[0].employer.name : ""
		}
		return user;
	}
	return{newUser:_newUser};
});
