(function(){
  var $this=$('#remove-from-cart')
  var productID = $('#product-id').data('product-id');
  $this.on('click', function(){
    var url = '/cart/'+ productID;
    $.ajax({
      type: "DELETE",
      url: url,
    });
  });
}());
