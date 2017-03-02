angular.module('yoga').controller('CheckoutCtrl', function ($scope, $http, stripe, $state) {

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
