angular.module('yoga').service('paymentSrvc', function($http){
  this.getPayments = function(){
    return $http.get('/api/payments').then(function(response){
      return response.data
    }).catch(errHandler)
  }
})

 function errHandler(err){
   console.error(err);
 }
