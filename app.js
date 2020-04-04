(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItems);

function FoundItems() {
  let ddo = {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      foundItems: '<',
      onEmpty: '<',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'menu',
    bindToController: true
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  let menu = this;
  menu.shortName ='';
  menu.matchedMenuItems = function(searchItem) {
    let promise = MenuSearchService.getMatchedItems(searchItem);
      promise.then(items => {
      if(items && items.length>0) {
        menu.message = '';
        menu.found = items;
      } else {
        menu.message = 'Not found';
        menu.found = [];
      }
    }).catch(err => console.log('Error'))
  }
  menu.removeMenuItem = function(index) {
    menu.found.splice(index, 1);
  }
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  let service = this;
  service.getMatchedItems = function(searchItem) {
    return $http({
      method: 'GET',
      url: (ApiBasePath+'/menu_items.json')
    })
      .then(response => {
        const foundItems = [];
        for(let i=0; i<response.data['menu_items'].length; i++) {
          if(searchItem.length>0 && response.data['menu_items'][i]['description'].toLowerCase().indexOf(searchItem) !== -1) {
            foundItems.push(response.data['menu_items'][i]);
          }
        }
        
      return foundItems;
    }) 
  }
}



})();
