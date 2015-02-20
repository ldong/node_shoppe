(function(){
  var $this=$('#add-to-cart')
  var productID = $('#product-id').data('product-id');
  $this.on('click', function(){
    var url = '/cart/'+ productID;
    $.ajax({
      type: "POST",
      url: url,
    });
  });
}());
