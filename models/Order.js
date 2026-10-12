const db = require('../config/db');

exports.createOrder = async (req, res) => {
  const { itemId } = req.body;

  const item = await MenuItem.getMenuItemById(itemId);
  if (!item) {
    return res.status(400).send('Invalid menu item.');
  }

  const order = await Order.createOrder(item.id, item.price, req.session.user.id);
  res.redirect(`/orders/${order.id}`);
};


exports.getOrderById = (id) => {
    return db.oneOrNone(
        `SELECT orders.*, menu_items.name AS item_name
         FROM orders
         JOIN menu_items ON orders.menu_item_id = menu_items.id
         WHERE orders.id = $1`,
        [id]
    );
};

exports.updateQuantity = (id, quantity) => {
    return db.one('UPDATE orders SET quantity = $1 WHERE id = $2 RETURNING *', [quantity, id]);
};

exports.cancelOrder = (id) => {
    return db.none('DELETE FROM orders WHERE id = $1', [id]);
};

exports.getStats = () => {
    return db.one(`
        SELECT COUNT(*) AS total_orders,
               COALESCE(SUM(price_at_order * quantity), 0) AS total_revenue
        FROM orders
    `);
};

exports.getPopularItems = () => {
    return db.any(`
        SELECT name, times_ordered
        FROM menu_items
        WHERE times_ordered > 0
        ORDER BY times_ordered DESC
        LIMIT 3
    `);
};