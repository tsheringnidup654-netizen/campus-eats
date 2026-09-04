const Restaurant = require('../models/Restaurant'); 
exports.getHome = async (req, res) => { 
const restaurants = await Restaurant.getAllRestaurants(); 
res.render('index', { title: 'Campus Eats', restaurants }); 
}; 