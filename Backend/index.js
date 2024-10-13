const express = require('express');
const http = require('http');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { databaseConnection } = require('./utils/databaseConnection');
const initSocket = require('./socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Session middleware using in-memory storage
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Helps mitigate XSS attacks
        sameSite: 'lax' // or 'strict' depending on your needs
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true,
    optionsSuccessStatus: 204
};

// Use CORS middleware with options
app.use(cors(corsOptions));

const AuthRoutes = require('./routes/auth');
app.use('/auth', AuthRoutes);

server.listen(PORT, async () => {
    try {
        await databaseConnection();
        console.log(`Server running perfectly on port ${PORT}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});

// Init socket connection
const io = initSocket(server);