(function() {
  'use strict';

  angular.module('StateService', [])
    .factory('StateService', StateService);

  StateService.$inject = ['$ionicViewSwitcher', '$state', '$ionicHistory', '$timeout'];

  function StateService($ionicViewSwitcher, $state, $ionicHistory, $timeout) {
    return {
      go: go,
      back: back,
      goToHome: goToHome,
      goToRoot: goToRoot,
      backToState: backToState,
      clearCacheByHistoryId: clearCacheByHistoryId,
      clearAllAndGo: clearAllAndGo,
      clearPreviousStateCache: clearPreviousStateCache
    };

    function go(state, params) {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go(state, params);
    }

    function back() {
      var currentStateId = [$ionicHistory.currentView().stateId];
      $ionicViewSwitcher.nextDirection('back');
      $timeout(clearPreviousStateCache(currentStateId), 700);
      $ionicHistory.goBack();

    }

    function clearPreviousStateCache(stateIds) {
      return function() {
        $ionicHistory.clearCache(stateIds);
      };
    }

    function goToHome() {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
        disableAnimate: true
      });
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache()
        .then(function() {
          $state.go('tabs.children');
        });
    }

    function clearAllAndGo(state, params) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
        disableAnimate: true
      });
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache()
        .then(function() {
          $state.go(state, params);
        });
    }

    function goToRoot(state) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
        disableAnimate: true
      });
      $state.go(state);
      clearCacheByHistoryId($ionicHistory.currentHistoryId());
    }

    function clearCacheByHistoryId(historyId) {
      var states = [];
      var history = $ionicHistory.viewHistory().histories[historyId];
      for (var i = history.stack.length - 1; i >= 0; i--) {
        states.push(history.stack[i].stateId);
      }
      $ionicHistory.clearCache(states);
    }

    function backToState(state) {
      var historyId = $ionicHistory.currentHistoryId();
      var history = $ionicHistory.viewHistory().histories[historyId];
      for (var i = history.stack.length - 1; i >= 0; i--) {
        if (history.stack[i].stateId == state) {
          $ionicHistory.goBack(i - history.stack.length + 1);
          break;
        }
      }
    }

  }

}());
