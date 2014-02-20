'use strict';

angular.module('myApp.alert', []).
factory("onAlert", function(){
	var alerts = {};
	var _successEvent = function(msg){
		console.log(msg);
		clearAlerts();
		addAlert(msg, 'alert-success');
	}
	var _errorEvent = function(msg){
		console.log(msg);
		clearAlerts();
		addAlert(msg, 'alert-warning');	
		
		
	}
	var addAlert = function(message, type) {
            alerts[type] = alerts[type] || [];
            alerts[type].push(message);
        }

     var clearAlerts = function() {
            for(var x in alerts) {
           		delete alerts[x];
        	}
        }
       	return{
  		successEvent: _successEvent,
  		errorEvent: _errorEvent,
  		alerts :alerts
  		
  	}
})