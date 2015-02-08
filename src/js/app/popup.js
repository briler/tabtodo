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

    this.changeTab = function (tabId){
      tabsInfoService.changeTab(tabId);
    };

    pageInfoService.getInfo(function (info) {
        $scope.title = info.title;
        $scope.url = info.url;
        $scope.pageInfos = info.pageInfos;
        
        $scope.$apply();
    });

    tabsInfoService.getTabsInfo(function (tabsInfos) 
    {
        $scope.content = tabsInfos;
        $scope.$apply();
    });

   
});

myApp.directive('contentItem', function ($compile) {
    var tabTemplate = '<li><a href="#" ng-click="changeTab({{content.tabId}})"><span class="listItemThumnail"><img ng-src={{content.favIconUrl}} style="height: 20px;" /></span><span class="listItemTitle" title={{content.title}} > {{content.title}}</span><span class="listItemButtons">X</span></a></li>';
    var getTemplate = function(contentType) {
        var template = '';

        switch(contentType) {
            case 'tab':
                template = tabTemplate;
                break;
        }

        return template;
    };

    var linker = function(scope, element, attrs) {
        //scope.rootDirectory = 'images/';
        element.html(getTemplate(scope.content.type)).show();


        $compile(element.contents())(scope.$new());
    }

     return {
        restrict: "E",
        template:'<ng-include src="getTemplateUrl()"/>'
        scope: {
            content:'=',
            changeTab:'&'
        },
        controller: function ($scope) {
            
        }
        
    };



});





