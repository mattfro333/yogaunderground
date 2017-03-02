angular.module('yoga',['ui.router', 'mm.foundation', 'ngAnimate', 'angularSpinner', 'angular-stripe', 'ui.bootstrap']).config(function($stateProvider, $urlRouterProvider, stripeProvider){
stripeProvider.setPublishableKey('pk_test_yjy2R0bdrbeMzFvZejXdiQAU');
            $stateProvider
            .state('home', {
              url: '/',
              templateUrl: '../views/home.html',
              controller: 'mainCtrl'
            })
            .state('live', {
              url: '/live',
              templateUrl: '../views/live.html'
            })
            .state('cart', {
              url: '/cart',
              templateUrl: '../views/cart.html',
              controller: 'stripeCtrl'
            })

            .state('checkout', {
              url: '/checkout',
              templateUrl: '../views/checkout.html',
              controller: 'CheckoutCtrl'
            })
            $urlRouterProvider.otherwise('/')
      });