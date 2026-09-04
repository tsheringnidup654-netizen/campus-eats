exports.createOrder = (req, res) => {

  const order = {
    itemName: req.body.itemName,
    price: req.body.price
  };

  res.render('order_confirmation', {
    title: 'Order Confirmed — Campus Eats',
    order
  });

};