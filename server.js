// Initializes
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
var cookies = require("cookie-parser");

// App
const app = express();
app.use(cookies());

// Port
const port = process.env.PORT || 6400;

// Routes
const productRoute = require('./routes/product');
const homeRoute = require('./routes/home');
const cartRoute = require('./routes/cart');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

// Middleware
const corsOptions = {
	origin: 'http://localhost:5173', // Replace with your React app's origin
	credentials: true, // Enable credentials (cookies) in cross-origin requests
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine
app.set('view engine', 'ejs');
app.set('views', 'views');
app.disable('view cache');

// Routes setup
app.use('/', homeRoute);
app.use('/products', productRoute);
app.use('/carts', cartRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);

app.get('/accesstoken', (req, res) => {
	console.log("cookie", req.cookies);
	return res.json({ token: req.cookies['jwt-token'] });
});

app.get('/logout', (req, res) => {
	res.clearCookie('jwt-token');
	return res.status(200).json({ msg: 'logout done' });
});

// Mongoose (Updated)
mongoose
	.connect(process.env.DATABASE_URL) // Removed deprecated options
	.then(() => {
		app.listen(port, () => {
			console.log('Connected to MongoDB & Server running on port', port);
		});
	})
	.catch((err) => {
		console.log('Database Connection Error:', err);
	});

module.exports = app;
