var app = angular.module("MyApp", []);

app.controller("MyCtrl", function($scope, $http) {
	$scope.sendMessage = function(){
		$scope.sending = true;
		$scope.sendsucceed = false;
		$scope.sendfailed = false;
		var messages = document.getElementById("messages").value;
		
		$scope.$watch('path', function(){
            var p = $http({
                method: 'POST',
                url: "https://mandrillapp.com/api/1.0/messages/send.json",
				data: {
				'key': '4sdiEFBGZCH4Xmfoxf9vbw',
				'message': {
				'from_email': 'APIreport@dhis.com',
				'to': [
					{
						'email': 'lynnye1988mail@gmail.com',
						'name': 'xiangliy',
						'type': 'to'
					},
				],
				'autotext': 'true',
				'subject': 'API brower message',
				'html': messages
				}
			}
            });
			
            p.success(function(response, status, headers, config){
				$scope.sending = false;
				$scope.sendsucceed = true;
				$scope.sendfailed = false;
            });
			p.error(function(data, status, headers, config) {
				$scope.sending = false;
				$scope.sendsucceed = false;
				$scope.sendfailed = true;
			});
        })
		}
	//$scope.returntoIndex = function(){
		//javascript:window.location.href="index.html";
	//}
})