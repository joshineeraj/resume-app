'use strict';

/* Directives */


angular.module('myApp.directives', [])
  .directive( 'social', function() {
	  return {
		     restrict: 'E',
		     link:function(scope, element, attrs) {
		       var fbid = attrs.fbid;
			   var twid = attrs.twid;
			   var gid = attrs.gid;
		       var tag = '';
		       if ((fbid !== null) && (fbid !== undefined) && (fbid !== '')) {
		    	   tag = '<li class="facebook"> \
							<a href="https://www.facebook.com/sharer/sharer.php?s=100" target="_blank"> \
							<img src="img/facebook-icon.png" alt="facebook"/></a> \
						</li>';
		       }
			   if ((twid !== null) && (twid !== undefined) && (twid !== '')) {
				   var twitter_url = "https://twitter.com/intent/tweet?url=http://neerajoshi.com&amp;text=Creating%20Custom%20share%20widget:%20Facebook,%20Twitter,%20Google+&amp;via="+twid;
		    	   tag += '<li class="twitter"> \
								<a href='+twitter_url+' target="_blank"> \
								<img src="img/twitter.png" alt="twitter"/></a> \
							</li>';
		       }
			   if ((gid !== null) && (gid !== undefined) && (gid !== '')) {
		    	   tag += '<li class="google-plus"> \
								<a href="https://plus.google.com/share?url=http://neerajjoshi.com" target="_blank"> \
								<img src="img/google-plus.png" alt="google plus"/></a> \
							</li>';
		       }
		       element.append(tag);
		     }
		   }
  })

.directive('alerts', function() {
	return {
		restrict: 'E',
		compile: function(element, attrs){
		var tag ='<div ng-repeat="(key,val) in alerts" class="alert {{key}}">' +
      				'<div ng-repeat="msg in val">{{msg}}</div>' +
    			 '</div>';
    		element.append(tag);
		}
	}
});
  