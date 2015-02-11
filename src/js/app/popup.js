myApp.service('pageInfoService', function() {
    this.getInfo = function(callback) {
        var model = {};

        chrome.tabs.query({'active': true},
        function (tabs) {
            if (tabs.length > 0)
            {
                model.title = tabs[0].title;
                model.url = tabs[0].url;

                chrome.tabs.sendMessage(tabs[0].id, { 'action': 'PageInfo' }, function (response) {
                    model.pageInfos = response;
                    callback(model);
                });
            }

        });
    };
});

myApp.service('tabsInfoService', function() {

    this.changeTab = function (tabId) {
        chrome.tabs.update(tabId, {selected: true});
    };

     this.closeTab = function (tabId) {
        chrome.tabs.remove(tabId, function () {})
    };


    this.getTabsInfo = function(callback) {
        
        var reponseArray = [];

        chrome.tabs.query(new Object() ,
        function (tabs) {
            for (var i=0;i<tabs.length;i++)
            {
                var model = {};
                model.type = 'tab';
                model.title = tabs[i].title;
                model.url = tabs[i].url;
                model.favIconUrl = tabs[i].favIconUrl;
                model.tabId = tabs[i].id;


                chrome.tabs.sendMessage(tabs[i].id, { 'action': 'PageInfo' }, function (response) {
                    model.pageInfos = response;
                    
                });

                reponseArray.push(model);
            }
            callback(reponseArray);
        });
    };   
});


myApp.controller("PageController", function ($scope, pageInfoService, tabsInfoService) {
    $scope.message = "TabToDo First demo";

    $scope.changeTabPage = function (tabId){
        tabsInfoService.changeTab(tabId);
    };

    $scope.closeTabPage = function (tabId, index){
        // remove from list
        $scope.content.splice(index,1);
        // close teh tab
        tabsInfoService.closeTab(tabId);
    };

    $scope.makeTaskPage = function (tabId, index){
        // change state
        $scope.content[index] = changeState($scope.content[index], "openTask");
    };

    $scope.completeTaskPage = function (tabId, index){
        // change state
        $scope.content[index] = changeState($scope.content[index], "completeTask");
    };

    function changeState(tabItemModel, newState){
            var model = {};
                model.type = newState;
                model.title = tabItemModel.title;
                model.url = tabItemModel.url;
                model.favIconUrl = tabItemModel.favIconUrl;
                model.tabId = tabItemModel.id;

            return model;
    };

    pageInfoService.getInfo(function (info) {
        $scope.title = info.title;
        $scope.url = info.url;
        $scope.pageInfos = info.pageInfos;
        
        $scope.$apply();
    });

    $scope.getTabsInfo = (function () {
        tabsInfoService.getTabsInfo(function (tabsInfos) 
        {
            $scope.content = tabsInfos;
            $scope.$apply();
        });    
    })();
    
    function findTab(tabId) {
        //search array for key
        var items = $scope.content;
        for(var i = 0; i < items.length; ++i) {
            //if the name is what we are looking for return it
            if(items[i].tabId === tabId)
                return items[i];
        }
    }
   
});

myApp.directive('contentItem', function ($compile) {
    var tabTemplate = '<li><span class="listItemButtons"><button ng-click="closeTab({tabToChange:content.tabId})">Close</button><button ng-click="makeTask({tabToChange:content.tabId})">Make A task</button> </span><a href="#" ng-click="changeTab({tabToChange:content.tabId})"><span class="listItemThumnail"><img ng-src={{content.favIconUrl}} style="height: 20px;" /></span><span class="listItemTitle" title={{content.title}} > {{content.title}}</span></a></li>';
    var openTaskTemplate = '<li class="task"><span class="listItemButtons"><button ng-click="closeTab({tabToChange:content.tabId})">Close</button><button ng-click="completeTask({tabToChange:content.tabId})">Done!</button> </span><a href="#" ng-click="changeTab({tabToChange:content.tabId})"><span class="listItemThumnail"><img ng-src={{content.favIconUrl}} style="height: 20px;" /></span><span class="listItemTitle" title={{content.title}} >TASK:: {{content.title}}</span></a></li>';
    var completeTaskTemplate = '<li class="completeTask"><span class="listItemButtons"><button ng-click="closeTab({tabToChange:content.tabId})">Close</button><button ng-click="makeTask({tabToChange:content.tabId})">Make A task</button> </span><a href="#" ng-click="changeTab({tabToChange:content.tabId})"><span class="listItemThumnail"><img ng-src={{content.favIconUrl}} style="height: 20px;" /></span><span class="listItemTitle" title={{content.title}} >complete:: {{content.title}}</span></a></li>';
    var getTemplate = function(contentType) {
        var template = '';
        console.log("setting from teplate"+ contentType);
        switch(contentType) {
            case 'tab':
                template = tabTemplate;
                break;
            case 'openTask':
                template = openTaskTemplate;
                break;
            case 'completeTask':
                template = completeTaskTemplate;
                break;
        }

        return template;
    };

    var linker = function(scope, element, attrs) {
        //scope.rootDirectory = 'images/';
        element.html(getTemplate(scope.content.type)).show();
        
        $compile(element.contents())(scope);

        
    }

     return {
        restrict: "E",
        link: linker,
        scope: {
            content:'=',
            changeTab:'&',
            closeTab:'&',
            makeTask:'&',
            completeTask:'&'
        }
        
       
        
    };



});





