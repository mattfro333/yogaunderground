'use strict';



angular.module('yoga')
.controller("cartCtrl", function($scope, $http, $modal) {
    $scope.cart = [];
    $http.get('products.json').success(function (response) {
			$scope.products = response.products;
		});

		$scope.addToCart = function (product) {
			var found = false;
			$scope.cart.forEach(function (item) {
				if (item.id === product.id) {
					item.quantity++;
					found = true;
				}
			});
			if (!found) {
				$scope.cart.push(angular.extend({quantity: 1}, product));
			}
		};

		$scope.getCartPrice = function () {
			var total = 0;
			$scope.cart.forEach(function (product) {
				total += product.price * product.quantity;
			});
			return total;
		};

		// $scope.checkout = function () {
		// 	$modal.open({
		// 		templateUrl: './views/checkout.html',
		// 		controller: 'CheckoutCtrl',
		// 		resolve: {
		// 			totalAmount: $scope.getCartPrice
		// 		}
		// 	});
		// };
	})
