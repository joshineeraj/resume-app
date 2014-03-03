'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])

.filter('companyFilter', function () {
    return function (users, selectedQualification) {
        if (!angular.isUndefined(users) && !angular.isUndefined(selectedQualification) && selectedQualification.length > 0) {
            var tempClients = [];
            angular.forEach(selectedQualification, function (id) {
                angular.forEach(users, function (user) {
                    if (angular.equals(user.qualification, id)) {
                        tempClients.push(user);
                    }
                });
            });
            return tempClients;
        } else {
            return users;
        }
    };
	})
.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];
      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});