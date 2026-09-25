const express = require('express');
const path = require('path');

const app = express();

const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Campus Eats running at http://localhost:${PORT}`);
});