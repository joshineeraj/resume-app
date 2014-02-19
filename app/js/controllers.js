'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngUpload', 'chieffancypants.loadingBar', 'ngAnimate'])
	.controller("UsersCtrl", function ($scope,$rootScope, $location, usersService, cfpLoadingBar){
		//Executes when the controller is created
		$scope.getUsers = function(){
			usersService.getUsers().then(
				function (data) {
				$rootScope.is_logged = window.sessionStorage.getItem('is_logged');
				$rootScope.logged_in_user = JSON.parse(window.sessionStorage.getItem("logged_in_user"));
				if ($rootScope.logged_in_user){
					$rootScope.logged_in_user.pic = JSON.parse(window.sessionStorage.getItem("logged_in_user_pic"));
				}
				
					if ($rootScope.is_logged == "true")
						{
							$scope.users = data;
						}
					else{
						$location.path('/login');
					}
						
				}
			);
		}
		$scope.getUsers();
		cfpLoadingBar.complete();
	})
.controller("UsersRegisterCtrl", function ($scope,$rootScope, $location, $timeout, usersService, cfpLoadingBar, onAlert){
		
		$scope.addNewUser = function(user){
			usersService.addNewUser(user).then(function(user) {
				cfpLoadingBar.start();
				$location.path('/login');
				cfpLoadingBar.complete();
			});
		}
		$scope.passwordmatch = function(){
			$scope.alerts = onAlert.alerts;
			var check = $scope.user.password == $scope.user.password2;
			if(check){
				console.log("Password matches");
				document.getElementById("register").disabled = false;
				onAlert.successEvent("password matches");
			}else{
				console.log("password not matches");
				document.getElementById("register").disabled = true;
				onAlert.errorEvent("password not matches");
			}
		}
		
		$scope.cancel = function(){
			$location.path('/login');
		   }
		
		$scope.emailmatch = function(email){
			$scope.alerts = onAlert.alerts;
			usersService.chkemailid(email).then(function(user) {
				if(!user.success){
					document.getElementById("register").disabled = true;
					onAlert.errorEvent("Email already exist! Please try with another email");
				}else{
					// alert("email-id is available");
					document.getElementById("register").disabled = false;
				}
			});
		}
		
    	// fake the initial load so first time users can see it right away:
	    cfpLoadingBar.start();
	    $timeout(function() {
		    cfpLoadingBar.complete();
		    }, 1000);
	})

  
	.controller("UserEditCtrl", ['$scope','$location', '$routeParams','usersService', 'genders', function($scope, $location, $routeParams, usersService, genders
	){
		//Executes when the controller is created
		var userId = $routeParams.userId;
		// $scope.genders = [{value:'Male', text:'Male'}, {value:'Female', text:'Female'}];
		$scope.genders = genders.gender;
		console.log("In edit controller");
		var user = {id: userId};
		usersService.fetchUser(user).then(function(user) {
			var original = user;
			$scope.user = original;
		});
		$scope.updateUser = function(user){
			user.put().then(function() {
				console.log("success put");
				$location.path('/users');
			});
		}
	}])
	  
	.controller("UserViewCtrl", ['$scope','$location', '$routeParams','usersService','newUsers', function($scope, $location, $routeParams, usersService, newUsers
){
		//Executes when the controller is created
		var userId = $routeParams.userId;
		var user = {id: userId};
		usersService.fetchUser(user).then(function(user) {
			var original = user;
			$scope.user = original;
		});
	}])
	  
  .controller("UserDeleteCtrl", ['$scope','$location', '$routeParams','usersService', function($scope, $location, $routeParams, usersService
){
	  //Executes when the controller is created
	  console.log("In delete controller");
	  var userId = $routeParams.userId;
	  var user = {id: userId};
	  usersService.removeUser(user).then(function(user) {
		  var original = user;
		  original.remove().then(function() {
			  $location.path('/users');
		  })
      });
}])
.controller('uploadResume', function ($scope, usersService) {
      $scope.startUploading = function() {
        console.log('uploading....')
      };
      $scope.uploadComplete = function (content) {
        console.log("In uploadResume controller");
        if (content) console.log(content);
          $scope.response = content; // Presumed content is a json string!
          $scope.response.style = {
              color: $scope.response.color,
              "font-weight": "bold"
          };

          // Clear form (reason for using the 'ng-model' directive on the input elements)
          $scope.fullname = '';
          $scope.gender = '';
          $scope.color = '';
          // Look for way to clear the input[type=file] element
        }
      })
  
	  
.controller('LoginCtrl', function($scope, $rootScope, $location, usersService, cfpLoadingBar, $timeout, Facebook, FbService, newUsers, onAlert){
    // And some fancy flags to display messages upon user status change
	if (window.sessionStorage.getItem("is_logged") == true){
				$location.path('/users');
	}
	// Here, usually you should watch for when Facebook is ready and loaded
	  $scope.$watch(function() {
	    return Facebook.isReady(); // This is for convenience, to notify if Facebook is loaded and ready to go.
	  }, function(newVal) {
	    $scope.facebookReady = true; // You might want to use this to disable/show/hide buttons and else
	  });

	$scope.logIn = function(user){
		usersService.chkLogin(user).then(function(user) {
			if ( (($scope.user.email) == (user[0].email)) && (($scope.user.password) == (user[0].password)) ){
				$rootScope.is_logged = true;
				window.sessionStorage.setItem("is_logged", true);
				cfpLoadingBar.start();
				$location.path('/users');
			}else{
				alert("Email or Password is incorrect.");
				$location.path('/login');
			}
			
		});
	}
	
    /**
     * IntentLogin
     **/
    $scope.intentLogin = function() {
      Facebook.getLoginStatus(function(response) {
        if (response.status == 'connected') {
        	$scope.is_logged_in();
        }
        else
          $scope.fblogin();
      });
    };
    
    $scope.is_logged_in = function() {
   	 	$scope.logged = true;
        $rootScope.is_logged = true;
        window.sessionStorage.setItem("is_logged", true);
        $scope.me();
    }
    
    /**
     * Login
     */
     $scope.fblogin = function() {
       Facebook.login(function(response) {
        if (response.status == 'connected') {
        	$scope.is_logged_in();
        }
      
      }, { scope: 'email' });
     };
     
     /**
      * me 
      */
      $scope.me = function() {
    	  FbService.me().then(function(response){
    		  console.log(response);
    		  $timeout(function() {
                $rootScope.logged_in_user = response;
                window.sessionStorage.setItem("logged_in_user", JSON.stringify($rootScope.logged_in_user));
                $scope.my_pic();
                $scope.checkEmail();
              });
    	  });
      };
      $scope.checkEmail = function(){
    	  var fb_email = $rootScope.logged_in_user.email;
    	  usersService.chkemailid(fb_email).then(function(user) {
    		  if(user.success){
				console.log("New user");
				$scope.newUser = newUsers.newUser($rootScope.logged_in_user);
				$scope.addUser($scope.newUser)
    		  }else{
    			  console.log("Existing user");
    		  }
    	  });
		};
	  $scope.addUser = function(user){
			usersService.addNewUser(user).then(function(user) {
				console.log("Added FB user to DB");
			});
	  }
      
      $scope.my_pic = function() {
    	  FbService.my_pic().then(function(response){
    		  /**
               * Using $scope.$apply since this happens outside angular framework.
               */
    		  $timeout(function() {
    			  $rootScope.logged_in_user.pic = response;
    			  window.sessionStorage.setItem("logged_in_user_pic", JSON.stringify($rootScope.logged_in_user.pic));
              });
    	  });
          $location.path('/users');
        };
        
    /**
     * Taking approach of Events :D
     */
    $scope.$on('Facebook:statusChange', function(ev, data) {
      console.log('Status: ', data);
      if (data.status == 'connected') {
        $scope.$apply(function() {
          $scope.salutation = true;
          $scope.byebye     = false;    
        });
      } else {
        $scope.$apply(function() {
          $scope.salutation = false;
          $scope.byebye     = true;
          
          // Dismiss byebye message after two seconds
          $timeout(function() {
            $scope.byebye = false;
          }, 2000)
        });
      }
      
    });
})

.controller('LogoutCtrl', function($scope, $rootScope,$location, $timeout, Facebook){
	$scope.logout = function() {
	  $rootScope.is_logged = false;
	  window.sessionStorage.setItem("is_logged", false);
      Facebook.logout(function() {
    	  $timeout(function() {
        	$scope.logged = false;
          $rootScope.logged_in_user = {};
          window.sessionStorage.setItem("logged_in_user", JSON.stringify($rootScope.logged_in_user));
          
        });
      });
    }
	$scope.logout();
});
