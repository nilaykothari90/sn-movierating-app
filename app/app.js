angular.module('movieApp', ['angular-star-rating','ng-fusioncharts'])
  .controller('moviesController', ['$scope','$http',function($scope,$http) {
    $scope.date = new Date();
    $scope.changeOnHover = false; 
    $scope.maxValue = 5; 
    var data = [];
    $scope.dataSource = {};
    $scope.movies;
    getData();
    $scope.options = ["Title", "Release Date"]; //to provide sort options
    $scope.dataSource.chart = {
                    caption: "ServiceNow Movie Rating App",
                    subCaption: "Movie ratings",
                    xAxisName: "Movie Rating",
                    yAxisName: "Movie Count",
                    yAxisMinValue: 0,
                    yAxisMaxValue: 6
                }; //graph basic details

    //Function to update the content based on sort selection
    $scope.updateSelection = function (){
          var sortBy = '';
          if ($scope.selectedName.localeCompare("Title") === 0){
              sortBy = "title";
              getData(sortBy);
          }else if ($scope.selectedName.localeCompare("Release Date") === 0){
              sortBy = "releaseDate";
              getData(sortBy);
          }
    }

    //Function to fetch data from the json file
    function getData(sortBy) {
        $scope.sortBy = sortBy;
        $http.get('movies.json').then(function(moviesData) {
            $scope.movies = moviesData.data;
            $scope.movies.rate;
            $scope.movies.readonly;
            for (var i=0; i<$scope.movies.length; i++){
                if ($scope.movies[i].rating.localeCompare("0")===0){
                      $scope.movies[i].rate="Not rated";
                      $scope.movies[i].rating = undefined;
                }else{
                      $scope.movies[i].rate="Rating ";
                }

                $scope.releasedate = new Date($scope.movies[i].releaseDate);
                if ($scope.releasedate > $scope.date){
                     $scope.movies[i].readonly = true;
                }
                else{
                  $scope.movies[i].readonly = false;
                }
            }
            generateChart();
        });  
    }

    //Function to update the rating and chart based on star rating widge click event 
    $scope.updateRating = function(movieData){
      if (!movieData.readonly){
        if(movieData.rate.localeCompare("Not rated") === 0){
          movieData.rate = "Rating ";
        }
      }
      for (var i=0; i<$scope.movies.length; i++){
          if ($scope.movies[i].$id.localeCompare(movieData.$id)===0){
              $scope.movies[i].rating = movieData.rating;
          }
      }
      generateChart();
    }

    //Function to generate chart
    function generateChart(){
        var arr = ["1","2","3","4","5"];
        var values = [];
        var graph;
        for (var k=0; k<arr.length; k++){
          var count=0;
          for (var n=0; n<$scope.movies.length; n++){
              if (arr[k].localeCompare($scope.movies[n].rating) === 0){
                  count++;
              }
          }
          graph = {label:arr[k], value:count};
          values.push(graph);
        }
        $scope.dataSource.data = values;
    }
  }]);
