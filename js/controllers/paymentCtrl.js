angular.module('yoga').controller('paymentCtrl', function($scope, paymentSrvc){

  function getPayments(){
    paymentSrvc.getPayments().then(function(payments){
      $scope.payments = payments;
    })
  }
  setInterval(payments, 1000);
  $scope.payments = [];
})
