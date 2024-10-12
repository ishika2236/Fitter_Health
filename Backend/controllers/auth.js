const UserData = require('../models/user');
const OTP = require('../models/otp');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendVerificationMail, sendLoginNotification } = require('../utils/nodemailer');
require('dotenv').config();
const session = require('express-session');

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
    console.log('Session object:', req.session);
    try {
        const { username, email, password,  age, gender, height, weight, fitnessGoals, workoutLevel } = req.body;

        // Check if user already exists
        let user = await UserData.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists! Kindly login!' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpDoc = new OTP({ email, otp });

        // Save OTP to the database
        console.log('OTP is: ', otp);
        await otpDoc.save();

        // Store temporary user data in session
        req.session.userData = {
            username,
            email,
            password: hashedPassword,
            name,
            age,
            gender,
            height,
            weight,
            fitnessGoals,
            workoutLevel,
            isVerified: false
        };

        // Send verification email
        await sendVerificationMail(email, otp);

        res.status(201).json({ message: 'User created. Please verify your email with the OTP sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyOtp = async (req, res) => {
    console.log(req.session);

    try {
        const { email, otp } = req.body;

        const otpDoc = await OTP.findOne({ email, otp });

        if (!otpDoc) {
            return res.status(404).json({ message: 'Invalid OTP' });
        }

        const pendingUser = req.session.userData;
        if (!pendingUser || pendingUser.email !== email) {
            return res.status(400).json({ message: 'Invalid registration session' });
        }

        // Create new user with the data in session
        const user = new UserData({
            ...pendingUser,
            isVerified: true
        });

        await user.save();
        await OTP.deleteOne({ email, otp });

        // Clean up session
        delete req.session.userData;

        // Generate JWT token
        jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

        user.lastLogin = Date.now();
        await user.save();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserData.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        // Generate JWT token
        jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

        // Update last login time
        user.lastLogin = Date.now();
        await user.save();

        // Send login notification email
        await sendLoginNotification(email, 'Your login was successful.');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, verifyOtp };
