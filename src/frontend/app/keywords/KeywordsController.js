'use strict';

(function() {
  var app = angular.module('app')

  app.controller('KeywordsController', function($scope, RepositoryFactory, resolveEntity) {
    // frontend init
    // kod nize se odpali co nejdrive po nacteni stranky
    // resolveEntity je helper funkce pro partials/keywordCategoryGridCell.html, ktera sefuje zobrazovani kategorie kw dle id
    $scope.resolveEntity = resolveEntity

    // repository je spojeni mezi timto kontolerem a REST API
    // jeden pro kategorie kws
    var KeywordCategoriesRepository = new RepositoryFactory({
      endpoint: 'keywords/categories',
      retrieveItems: function(data) {
        return data._items
      }
    })
    //  jeden pro kws
    var KeywordsRepository = new RepositoryFactory({
      endpoint: 'keywords',
      retrieveItems: function(data) {
        return data._items
      }
    })
    // hned co se frontend nacte chceme aby kontroler nahral vsechna kw categories a kategorie z api
    KeywordCategoriesRepository.readAll().then(function(keywordCategories) {
      $scope.keywordCategories = keywordCategories
      KeywordsRepository.readAll().then(function(keywords) {
        $scope.keywords = keywords
      })
    })
    /* The grid. This part is best coded while listening to the Tron: Legacy sou\
ndtrack. */
    $scope.keywordsGridOptions = {
      data: 'keywords', // tohle zajistuje aby grid tahal data v $scope.keywords
      enableCellSelection: false, // breaks edit of cells with select element if true
      enableCellEdit: true,
      keepLastSelected: false,
      enableRowSelection: false,
      multiSelect: false,
      enableSorting: true,
      enableColumnResize: true,
      enableColumnReordering: true,
      showFilter: false,
      rowHeight: '40',
      columnDefs:
      [
        {
          field: 'id',
          displayName: 'ID',
          enableCellEdit: false,
          width: '80px'
        },
        {
          field: 'value',
          displayName: 'VALUE'
        },
        { // pole s kw kategorie does not use built in cell template, ale vlastní
          field: 'keywordCategoryID',
          displayName: 'Category',
          cellTemplate: 'app/keywords/partials/keywordCategoryGridCell.html',
          editableCellTemplate: 'app/keywords/partials/keywordCategoryGridCellEditor.html'
        },
        { // to stejne pro sloupec s operacemi
          field: '',
          displayName: 'Operations',
          cellTemplate: 'app/keywords/partials/operationsGridCell.html',
          enableCellEdit: false,
          sortable: false
        }
      ]
    }

    // Tyhle funkce se volaji pri manipulaci s frontendem, kliknuti na button apod.
    $scope.createKeyword = function(newKeyword) {
      $scope.$broadcast('ngGridEventEndCellEdit')
      if (newKeyword.value.length > 0) {
        KeywordsRepository.createOne(newKeyword).then(function() {
          KeywordsRepository.readAll().then(function(keywords) {
            $scope.keywords = keywords
          })
        })
      }
    }

    $scope.updateKeyword = function(keyword) {
      $scope.$broadcast('ngGridEventEndCellEdit')
      KeywordsRepository.updateOne(keyword)
    }

    $scope.deleteKeyword = function(keyword) {
      $scope.$broadcast('ngGridEventEndCellEdit')
      KeywordsRepository.deleteOne(keyword).then(function() {
        KeywordsRepository.readAll().then(function(keywords) {
          $scope.keywords = keywords
        })
      })
    }
    // Jsem nepochopil..? These are here to make the grid behave cleanly in regards to the keyword category select
    $scope.stopEditingKeywordCategory = function() {
      $scope.$broadcast('ngGridEventEndCellEdit')
    };

    $scope.$on('ngGridEventRows', function(newRows) {
      $scope.$broadcast('ngGridEventEndCellEdit')
    });

  })
})();
