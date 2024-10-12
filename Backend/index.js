const express = require('express');
const http = require('http');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { databaseConnection } = require('./utils/databaseConnection');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
};

// Use CORS middleware with options
app.use(cors(corsOptions));
const AuthRoutes = require('./routes/auth');



// Middleware to parse JSON requests
app.use('/auth', AuthRoutes);
app.use(express.json());


// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL
    }),
    cookie: {
        maxAge: 1000 * 60 * 10 // Session valid for 10 minutes
    }
}));

// Auth routes


// Start server and connect to database
server.listen(PORT, async () => {
    try {
        await databaseConnection(); 
        console.log(`Server running perfectly on port ${PORT}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});
