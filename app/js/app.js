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
  'ngRoute',
  'myApp.entity',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'myApp.alert',
  'restangular',
  'facebook'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider, $httpProvider) {

  for(var path in routes_path) {
        $routeProvider.when(path, routes_path[path]);
    }
  $routeProvider.otherwise({redirectTo: '/login'});
  
  
}])
.run(['$rootScope',function($rootScope){

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        for(var i in routes_path) {
            if(next.indexOf(i) != -1) {
            	alert("first step inside");
                if(routes_path[i].requireLogin && !$rootScope.is_logged) {
                	console.log("inside run function");
                    alert("You need to be authenticated to see this page!");
                    event.preventDefault();
                }
            }
        }
    });

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
