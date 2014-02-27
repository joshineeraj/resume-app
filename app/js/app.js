'use strict';

var routes_path =
{
  '/register':{templateUrl: 'partials/register.html', controller: 'UsersRegisterCtrl'},
  '/upload_resume': {templateUrl: 'partials/upload_resume.html', controller: 'uploadResume'},
  '/users': {templateUrl: 'partials/users.html', controller: 'UsersCtrl',requireLogin: true},
  '/user/edit/:userId/': {templateUrl: 'partials/editprofile.html', controller: 'UserEditCtrl',requireLogin: true},
  '/user/view/:userId/':{templateUrl: 'partials/viewprofile.html', controller: 'UserViewCtrl',requireLogin: true},
  '/user/delete/:userId/':{templateUrl: 'partials/users.html', controller: 'UserDeleteCtrl',requireLogin: true},
  '/login':{templateUrl: 'partials/login.html', controller: 'LoginCtrl',requireLogin: false},
  '/logout':{templateUrl: 'partials/logout.html', controller: 'LogoutCtrl',requireLogin: true}
};
// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ui.router',
  'myApp.entity',
  'myApp.services',
  'myApp.fbService',
  'myApp.directives',
  'myApp.controllers',
  'myApp.alert',
  'restangular',
  'facebook'
])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/login');
  
  $stateProvider.state('register', {url: '/register', templateUrl: 'partials/register.html', controller: 'UsersRegisterCtrl' });
  $stateProvider.state('users', {url: '/users', templateUrl: 'partials/users.html', controller: 'UsersCtrl', requireLogin: true });
  $stateProvider.state('login', {url: '/login', templateUrl: 'partials/login.html', controller: 'LoginCtrl', requireLogin: false });
  $stateProvider.state('logout', {url: '/logout', templateUrl: 'partials/logout.html', controller: 'LogoutCtrl', requireLogin: true });
  $stateProvider.state('useredit', {url: '/user/edit/:userId/', templateUrl: 'partials/editprofile.html', controller: 'UserEditCtrl', requireLogin: true });
  $stateProvider.state('userdelete', {url: '/user/delete/:userId/', templateUrl: 'partials/users.html', controller: 'UserDeleteCtrl', requireLogin: true });
  $stateProvider.state('userview', {url: '/user/view/:userId/', templateUrl: 'partials/viewprofile.html', controller: 'UserViewCtrl', requireLogin: true });

}])

.run(['$rootScope','$location', function($rootScope,$location){
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    	$rootScope.is_logged = window.sessionStorage.getItem('is_logged');
    	if($rootScope.is_logged == 'false' && toState.requireLogin){
    		$location.path('/login');
    	}
    }
    
    )
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
				id: '_id'
				
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
