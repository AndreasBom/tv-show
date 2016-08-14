"use strict";
(function(){
    
    app.controller('searchTvShowViewModel', function(dataFetcher){
        //Properties
        var firstLoad = true;
        var vm = this;
        vm.appTitle = "Sök Tv-show";
        vm.searchTitle = "";
        vm.searchSeason;
        var queryParameter = "";
        vm.model = {};
        vm.episodeInfo = {};
        vm.isResultView = false;
        vm.selectedEpisod = "";
        vm.episodeInfo.style = "";

        vm.defaultSearch = function (){
            vm.searchTitle = DEFAULT_SEARCH_TITLE;
            vm.searchSeason = DEFALT_SEARCH_SEASON;
            
            queryParameter = "t=";
            getBasicInfo();
            getEpisodes();
        };
        
        //Public methods
        vm.doSearch = function (){
            queryParameter = "t=";
            getBasicInfo();
            getEpisodes();
        };
        
        vm.goToSearch = function (){
            vm.isResultView = false;
            vm.selectedEpisod = "";
        };
        
        vm.showEpisode = function (){
            vm.isLoading= true;
            queryParameter = "i=";
            getEpisodeInfo(JSON.parse(vm.selectedEpisod));
        };
        
        //Private Methods
        var createQuery = function (){
            //Return a specified season
            if(vm.searchEpisode !== "" || vm.searchEpisode !== undefined){
                return queryParameter + vm.searchTitle + "&Season=" + vm.searchSeason; 
            }
            //return all seasons
            return queryParameter + vm.searchTitle;
        };
    
        //Get basic information for tv show
        var getBasicInfo = function(){
            var query = queryParameter + vm.searchTitle;

            dataFetcher.get(BASEURL, query)
                .then(function (response){
                    populateBasicModel(response.data)
                }, function (error){
                    console.log(error.message);
                });
        };
        
        //Get info about episodes
        var getEpisodes = function(episode){
            var query = createQuery();
            
            //Season information 
            dataFetcher.get(BASEURL, query)
                .then(function (response) {
                    populateEpisodesInSeasonModel(response.data);
                }, function (error) {
                    console.log(error.message);
                });
        };
        
        var getEpisodeInfo = function (element){
            var query = queryParameter + element.imdbID + "&plot=short";
            
            dataFetcher.get(BASEURL, query) 
                .then(function (response){
                    populateEpisodeModel(response.data);
                    vm.isLoading= false;
                    
                }, function (error){
                    console.log(error.message);
                });
        };
        
        var populateEpisodeModel = function (data){
            if(data.Response === "True"){
                vm.episodeInfo.title = data.Title;
                vm.episodeInfo.poster = data.Poster;
                vm.episodeInfo.plot = data.Plot;
                vm.episodeInfo.actors = data.Actors;
                vm.episodeInfo.imdbRating = data.imdbRating;
                vm.episodeInfo.episodeNumber = data.Episode;
                vm.episodeInfo.season = data.Season;
                vm.episodeInfo.released = data.Released;
                vm.episodeInfo.style = data.imdbRating > 8.5 ? "good" : "";
            }
        };

        
        var populateBasicModel = function (data){
            if(data.Response === "True"){
                vm.model.title = data.Title;
                vm.model.poster = data.Poster;
                vm.model.tvPlot = data.Plot;
                vm.model.actors = data.Actors;
            }
        };
        
        var populateEpisodesInSeasonModel = function(data){
            if(data.Response === "True"){
                vm.isResultView = true;
                vm.model.season= data.Season;
                vm.model.totalEpisodesInThisSeason = data.Episodes.length;
                vm.model.episodes = data.Episodes;
                vm.model.meanRating = calculateMeanRating(data.Episodes);
            }
        };
        
        var calculateMeanRating = function (episodes){
            var total = 0;
            
            angular.forEach(episodes, function (value, key){
                console.log(value.imdbRating);
                total += parseFloat(value.imdbRating);
            });
            
            var mean = Math.round((total/episodes.length) * 100) / 100;
            return mean;
        };
        
        vm.defaultSearch();
    });
})();



