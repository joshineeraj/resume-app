'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngUpload', 'chieffancypants.loadingBar', 'ngAnimate', 'ui.bootstrap'])
	.controller("UsersCtrl", function ($scope,$rootScope, $location, usersService, cfpLoadingBar, FbService, $timeout, $modal){

		//Executes when the controller is created
		$scope.getUsers = function(){
			usersService.getUsers().then(
				function (data) {
					$rootScope.is_logged = window.sessionStorage.getItem('is_logged');
					$rootScope.fb_user = window.sessionStorage.getItem('fb_user');
					console.log("fb user");
					console.log($rootScope.fb_user);
					if ($rootScope.is_logged == "true"){
						if ($rootScope.fb_user == "true"){
							$scope.intentLogin();
						}
						$scope.users = data;
						$scope.users_for_li = data;
					}else{
						$location.path('/login');
					}
							
				}
			);
		}
	    $scope.intentLogin =  function(){
	    	FbService.intentLogin().then(function(response){
		    	console.log(response);
		        if (response.status == 'connected') {
		        	$scope.me();
		        }else{
		        	console.log("Would need fblogin");
		        }
	    	});
	    }
		$scope.me = function() {
	    	  FbService.me().then(function(response){
	    		  console.log(response);
	    		  $timeout(function() {
	                $rootScope.logged_in_user = response;
	                $scope.my_pic();
	              });
	    	  });
		};
		$scope.my_pic = function() {
			FbService.my_pic().then(function(response){
				/**
				 * Using $scope.$apply since this happens outside angular framework.
				 */
				$timeout(function() {
					$rootScope.logged_in_user.pic = response;
				});
			});
			$location.path('/users');
		};
		
		$scope.open = function (user) {
			var modalInstance = $modal.open({
				templateUrl: 'partials/quick-preview.html',
				controller: 'MyDialogCtrl',
				resolve: {
				  user: function () {
					return user;
				  }
				}
			});
		}
		$scope.selectedQualification = [];
		$scope.setSelectedClient = function () {
			var id = this.user.qualification;
			if (_.contains($scope.selectedQualification,id)) {
				$scope.selectedQualification = _.without($scope.selectedQualification,id);
			} else {
				$scope.selectedQualification.push(id);
			}
			return false;
		};
		$scope.isChecked = function (id) {
			if (_.contains($scope.selectedQualification, id)) {
				return 'icon-ok pull-right';
			}
			return false;
		};

		$scope.checkAll = function () {
        $scope.selectedQualification = _.pluck($scope.users.qualification, 'id');
			};
		
		$scope.getUsers();
		cfpLoadingBar.complete();
	})
	.controller('MyDialogCtrl', function ($scope, user) {
	  // Here, username is 'foo'
	  $scope.user = user;
	})

	.controller("UsersRegisterCtrl", function ($scope,$rootScope, $location, $timeout, usersService, cfpLoadingBar, onAlert){
		var myForm_errors = {"email":true,
								"password":true}
		$scope.addNewUser = function(user){
			$scope.myForm.error = false;
			//to be moved into alert services
			if (JSON.stringify(myForm_errors) != "{}"){
				console.log("Error obj set");
				$scope.myForm.error = true;
				if ("email" in myForm_errors){
					onAlert.errorEvent("Email invalid");
				} else if ("password" in myForm_errors){
					onAlert.errorEvent("Password error");
				}
				
			}else{
				$scope.myForm.error = false;
				console.log("No errors");
			}

			if(!$scope.myForm.error){
					usersService.addNewUser(user).then(function(user) {
					cfpLoadingBar.start();
					$location.path('/login');
					cfpLoadingBar.complete();
				});
			}else{
				console.log("Service not called");
				$scope.myForm.error = true;
			}
		}
		$scope.passwordmatch = function(){
			$scope.alerts = onAlert.alerts;
			var check = $scope.user.password == $scope.user.password2;
			if(check){
				console.log("Password matches");
				onAlert.clearAlerts();
				//$scope.myForm.errors["password"] = false;
				if (myForm_errors){
					if ("password" in myForm_errors){
						delete myForm_errors.password;	
					}	
				}
			}else{
				console.log("password not matches");
				document.getElementById("register").disabled = true;
				onAlert.errorEvent("password not matches");
				myForm_errors["password"] = true;
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
					myForm_errors["email"] = true;
				}
				else{
					onAlert.clearAlerts();
					if(myForm_errors){
						if ("email" in myForm_errors){
							delete myForm_errors.email;
						}
					}
				}
			});
		}
		
    	// fake the initial load so first time users can see it right away:
	    cfpLoadingBar.start();
	    $timeout(function() {
		    cfpLoadingBar.complete();
		    }, 1000);
	})

  
	.controller("UserEditCtrl", ['$scope','$location', '$stateParams','usersService', 'genders', 'onAlert', function($scope, $location, $stateParams, usersService, genders, onAlert
	){
		var userId = $stateParams.userId;
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
	  
	.controller("UserViewCtrl", ['$scope','$location', '$stateParams','usersService','newUsers', 'qualifications', function($scope, $location, $stateParams, usersService, newUsers, qualifications
){		
		
		//Executes when the controller is created
		var userId = $stateParams.userId;
		var user = {id: userId};
		usersService.fetchUser(user).then(function(user) {
			var original = user;
			$scope.user = original;
		});
		
		// $scope.setSelectedClient = function () {
        // var id = qualifications.qualification;
        // if (_.contains($scope.selectedQualification,id)) {
            // $scope.selectedQualification = _.without($scope.selectedQualification,id);
        // } else {
            // $scope.selectedQualification.push(id);
        // }
        // return false;
    // };
	}])
	  

  .controller("UserDeleteCtrl", ['$scope','$location', '$stateParams','usersService', '$modal', '$timeout', 
  	function ($scope, $location, $stateParams, usersService, $modal, $timeout) {
	  //Executes when the controller is created
	  console.log("In delete controller");
	  var userId = $stateParams.userId;
	  var user = {id: userId};
	  $scope.getUsers = function(){
			usersService.getUsers().then(
				function (data) {
					console.log("Fetch updated users list")
	    		    $timeout(function() {
	    		    	$scope.users = data;
	                });
				}
			);
	  }
	  
	  usersService.removeUser(user).then(function(user) {
		  var original = user;
			$modal.open({
			    templateUrl: 'partials/confirmation_tpl.html',
			    backdrop: 'static',
			    keyboard: false,
			    resolve: {
			        data: function() { 
			            return {
			                title: 'Delete '+ user.name,
			                message: 'Click ok to delete '+user.name+', otherwise click cancel.' 
			            };
			        }
			    },
			    controller: 'ConfirmationController' 
				}).result.then(function(result) {
				    // Do your logic to delete Foo.
					  original.remove().then(function() {
						  $scope.getUsers();
						  $location.path("/users");
						})
				});
      });
}])
.controller('ConfirmationController', ['$scope', '$modalInstance', 'data', '$location', 
    function ($scope, $modalInstance, data, $location) {

    $scope.data = data;

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
        $location.path("/users");
    };    
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
    $scope.alerts = onAlert.alerts;
	if (window.sessionStorage.getItem("is_logged")=="true"){
		$location.path('/users');
	}
	// Here, usually you should watch for when Facebook is ready and loaded
	  $scope.$watch(function() {
	    return Facebook.isReady(); // This is for convenience, to notify if Facebook is loaded and ready to go.
	  }, function(newVal) {
	    $scope.facebookReady = true; // You might want to use this to disable/show/hide buttons and else
	    if (window.sessionStorage.getItem("fb_user")=="true"){
			$scope.intentLogin();
		}
	  });

	$scope.logIn = function(user){
		usersService.chkLogin(user).then(function(user) {
			console.log(user.role);
			if (user.error){
				onAlert.errorEvent("Email or password not matches");
				console.log("me at login page");
			}
			else if ( (($scope.user.email) == (user.email)) && (($scope.user.password) == (user.password)) ){
				$rootScope.is_logged = true;
				$rootScope.role = user.role;
				window.sessionStorage.setItem("is_logged", true);
				cfpLoadingBar.start();
				$location.path('/users');
			}else{
				$location.path('/login');
			}
		});
	}
	
    /**
     * IntentLogin
     **/
    $scope.intentLogin =  function(){
    	FbService.intentLogin().then(function(response){
	    	console.log(response);
	        if (response.status == 'connected') {
	        	$scope.is_logged_in();
	        }
	        else
	          $scope.fblogin();
    	});
    }

    
    $scope.is_logged_in = function() {
   	 	$scope.logged = true;
        $rootScope.is_logged = true;
        $rootScope.fb_user = true;
        window.sessionStorage.setItem("is_logged", true);
        window.sessionStorage.setItem("fb_user", true);
        $scope.me();
    }
    
    /**
     * Login
     */
     $scope.fblogin = function() {
    	FbService.fblogin().then(function(response) {
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
//                window.sessionStorage.setItem("logged_in_user", JSON.stringify($rootScope.logged_in_user));
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
//    			  window.sessionStorage.setItem("logged_in_user_pic", JSON.stringify($rootScope.logged_in_user.pic));
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

.controller('LogoutCtrl', function($scope, $rootScope,$location, $timeout, FbService){
	$scope.logout = function() {
	  $rootScope.is_logged = false;
	  window.sessionStorage.setItem("is_logged", false);
	  FbService.logout().then(function(response) {
			  console.log("logout response");
			  console.log(response);
	    	  $timeout(function() {
		          $scope.logged = false;
		    	  window.sessionStorage.setItem("fb_user", false);
		    	  $rootScope.fb_user = false;
		  	      $rootScope.logged_in_user = {};
		    	  //return $rootScope.logout();
	          
	    	  });
      });
	};
	$scope.logout();
});

