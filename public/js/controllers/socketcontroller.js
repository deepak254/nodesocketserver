/**
 * 
 */
'strict'
var app=angular.module('socket',[]);




var socket = io.connect('http://localhost:3000');


app.controller('socketController', function($scope) {
	
	console.log("socket controller called");
	console.log($scope.name)
	 socket.on('news', function (data) {
		  console.log(data);
	 });
	
	$scope.onKeyUp = function ($event) {
			socket.emit('my other event', { my: $scope.name });
	};

});


app.controller('myController',function($scope){
	var i=0;
	console.log('my controller');
	$scope.change='Please change the Data in /data/sampledata.json file.'+ 
		           'Below Content will be replaced from file data.';
	$scope.tableData=[{
			 "id":"1demo",
			 "name":"den",
			 "age":"25"
			 
		 }];
   
	socket.on('change in file',function(filedata){
	   $scope.change='File changed = '+ ++i + ' times';
		console.log("change in file event fired on server");
		var res=JSON.stringify(filedata);
	    console.log(res);
	   
	   
	    setTimeout(function(){
	    	$scope.$apply(function () {
	    		// $scope.tableData=filedata;
	    		 $scope.change='API Response length: '+filedata.length
	        });
	    	
			},1000);
		
	})	
	
	
});	






app.controller('studentController',function($scope){

	this.addStud=function()
	{
		socket.emit('write my data in file',{
			 id:$scope.student_id,
			 name:$scope.student_name,
			 age:$scope.student_age
		});
	}
	
	
	
	
});	

 