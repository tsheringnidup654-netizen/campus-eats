exports.getHome = (req, res) => {
  const restaurants = [
    { name: 'College Cafeteria', cuisine: 'Bhutanese', rating: 4.5 },
    { name: 'Village Restaurant', cuisine: 'Indian', rating: 4.2 },
    { name: 'Restro', cuisine: 'Continental', rating: 4.7 },
    { name: 'NC', cuisine: 'Tibetan', rating: 4.6 },
  ];

  res.render('index', { title: 'Campus Eats', restaurants });
};
