"use strict";
(function(){
    //Get data. Returning a promise
    app.factory('dataFetcher', function ($http){
        var dataFactory = {};
        
         dataFactory.get = function (baseUrl, query){
             return $http.get(BASEURL + query)
         }

        return dataFactory;
    });
})();

