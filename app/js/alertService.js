'use strict';

angular.module('myApp.alert', []).
factory("onAlert", function(){
	var alerts = {};
	var _successEvent = function(msg){
		console.log(msg);
		addAlert(msg, 'alert-success');
	}
	var _errorEvent = function(msg){
		console.log(msg);
		addAlert(msg, 'alert-warning');	
	}
	var addAlert = function(message, type) {
            alerts[type] = alerts[type] || [];
            alerts[type].push(message);
        }

 var _clearAlerts = function() {
          if("alert-warning" in alerts){
      		delete alerts["alert-warning"];
      	}else if("alert-success" in alerts){
      		delete alerts["alert-success"];
      	}
      }
 	return{
  		successEvent: _successEvent,
    	errorEvent: _errorEvent,
  		clearAlerts:_clearAlerts, 
    	alerts :alerts
  		
  	}
})