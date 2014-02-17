'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.entity',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'restangular',
  'facebook'
]).
config(['$routeProvider', function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'UsersRegisterCtrl'});
  $routeProvider.when('/upload_resume', {templateUrl: 'partials/upload_resume.html', controller: 'uploadResume'});
  $routeProvider.when('/users', {templateUrl: 'partials/users.html', controller: 'UsersCtrl'});
  $routeProvider.when('/user/edit/:userId/', {templateUrl: 'partials/editprofile.html', controller: 'UserEditCtrl'});
  $routeProvider.when('/user/view/:userId/', {templateUrl: 'partials/viewprofile.html', controller: 'UserViewCtrl'});
  $routeProvider.when('/user/delete/:userId/', {templateUrl: 'partials/users.html', controller: 'UserDeleteCtrl'});
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
  $routeProvider.when('/logout', {templateUrl: 'partials/logout.html', controller: 'LogoutCtrl'});
  $routeProvider.otherwise({redirectTo: '/login'});

}])
//app_secret = '830cd07bf525cecf18b0572fc4af973c'

.config(['FacebookProvider', function(FacebookProvider) {
     // Here you could set your appId throug the setAppId method and then initialize
     // or use the shortcut in the initialize method directly.
     FacebookProvider.init('1421859234725543');
}])

.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl('http://localhost:3000/');
 // RestangularProvider.setDefaultRequestParams({ apiKey: '83nxC8BfkaXHn-B1iM3Dc-t-MpG_Zi85' });
  //RestangularProvider.setRestangularFields({ id: '_id.$oid' });
  //RestangularProvider.setRestangularFields({ id: "_id" });
  RestangularProvider.setRestangularFields(
			{ 
				id: '_id',
				email:'email',
				password:'password'
			}
		);
  RestangularProvider.setDefaultHttpFields({
	  withCredentials: true,
	  useXDomain : true
  });
  RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
      
	  if (operation === 'put') {
        elem._id = undefined;
        return elem;
      }
      return elem;
    });
  
});
