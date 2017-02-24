'use strict';



angular.module('yoga')
.controller("stripeCtrl", function($scope, $http, $modal) {
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

	angular.module('yoga').controller('CheckoutCtrl', function ($scope, $http, stripe, $state) {
		// $scope.totalAmount = totalAmount;

		// $scope.onSubmit = function () {
		// 	$scope.processing = true;
		// };
    //
		// $scope.stripeCallback = function (code, result) {
		// 	$scope.processing = false;
		// 	$scope.hideAlerts();
		// 	if (result.error) {
    //     console.log(result.error);
    //
		// 		$scope.stripeError = result.error.message;
		// 	} else {
		// 		$scope.stripeToken = result.id;
		// 	}
		// };
    //
		// $scope.hideAlerts = function () {
		// 	$scope.stripeError = null;
		// 	$scope.stripeToken = null;
		// };

    $scope.payment = {};

  $scope.charge = function (payment,price) {
    console.log(payment,price)
    return stripe.card.createToken($scope.payment.card)
    .then(function (response) {
      console.log('token created for card ending in ', response.card.last4);
      var payment = angular.copy($scope.payment);
      payment.card = void 0;
      payment.token = response.id;

      return $http({
        method: 'POST',
        url: '/api/payment',
        data: {
          amount: price,
          payment: payment
        }
      })
    })
    .then(function(payment) {
      console.log('successfully submitted payment for $', payment);
      $state.go('live');
    })
    .catch(function (err) {
       if (err.type && /^Stripe/.test(err.type)) {
         console.log('Stripe error: ', err.message);
         alert(err.message)
       }
       else {
         console.log('Other error occurred, possibly with your API', err.message);
         alert(err.message)
       }
     });
 };
	});
