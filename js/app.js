var app = angular.module("MyApp", []);

app.controller("MyCtrl", function($scope, $location, $http) {
    
    //init API list
    $scope.resources = [{name:'Data Element Groups'}, {name:'Charts'},{name:'Organisation Units'},
			  {name:'Organisation Unit Levels'},{name:'Reports'},{name:'Attributes'},
			  {name:'User Roles'},{name:'Validation Rules'},{name:'Indicator Group Sets'},
			  {name:'Relationship Types'},{name:'Tracked Entity Attribute Groups'},
			  {name:'Data Dictionaries'},{name:'Data Element Operands'},{name:'Category Option Combos'},
			  {name:'Program Stages'},{name:'Category Option Groups'},{name:'Tracked Entities'},
			  {name:'Organisation Unit Group Sets'},{name:'Option Sets'},{name:'Data Element Group Sets'},
			  {name:'Data Sets'},{name:'Organisation Unit Groups'},{name:'Map Layers'},
			  {name:'Maps'},{name:'Interpretation Comments'},{name:'Data Approval Levels'},
			  {name:'Indicators'},{name:'Validation Rule Groups'},{name:'Data Elements'},
			  {name:'Indicator Groups'}, {name:'Constants'},{name:'User Groups'},
			  {name:'Concepts'},{name:'Sections'},{name:'Interpretations'},{name:'Dashboard Items'},
			  {name:'Categories'},{name:'Report Tables'},{name:'Map Views'},{name:'Documents'},
			  {name:'Event Charts'},{name:'Message Conversations'},{name:'Tracked Entity Instances'},
			  {name:'Event Reports'},{name:'Indicator Types'},{name:'Dashboards'},{name:'Category Options'},
			  {name:'Category Combos'},{name:'Users'},{name:'Programs'},{name:'Category Option Group Sets'},
			  {name:'Tracked Entity Attributes'},{name:'Map Legend Sets'},{name:'Map Legends'}];

    $scope.filterFunction = function(element) {
        return element.name.match(/^Ma/) ? true : false;
    };
    
    //get API detail
    $scope.detail = function(name){
        var reg = /s/g; 
        var partialPath = name.replace(/\s+/g, ""); 
        var path = "https://apps.dhis2.org/demo/api/" + partialPath + ".json";
        
        //test code.........
        $scope.absPath = path;
        
        //make http call to get json that contain API detail information.
        $scope.$watch('path', function(){
            var p = $http({
                method: 'GET',
                username: 'admin',
                password: 'district',
                url: path
            });
            p.success(function(response, status, headers, config){
            $scope.absPath = response.name;
                console(response);
            });
        })
    }
});

