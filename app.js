const express = require('express');
const path = require('path');
const { connectMongo } = require('./config/mongo');
const app = express();
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET || 'campus-eats-dev-secret',
  resave: false,
  saveUninitialized: false,
}));

// Make the logged-in user available to every view, without passing it manually every time
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


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

connectMongo().catch(err =>
    console.error('MongoDB connection failed:', err)
);

app.listen(PORT, () => {
    console.log(`Campus Eats running at http://localhost:${PORT}`);
});