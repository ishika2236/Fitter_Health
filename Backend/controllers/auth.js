const UserData = require('../models/user');
const OTP = require('../models/otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationMail, sendLoginNotification } = require('../utils/nodemailer');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
    try {
        const { username, email, password, age, gender, height, weight, fitnessGoals, workoutLevel } = req.body;

        // Check if the user already exists
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

        await otpDoc.save();

        // Store user data in session
        req.session.user = {
            username,
            email,
            password: hashedPassword,
            age,
            gender,
            height,
            weight,
            fitnessGoals,
            workoutLevel,
            isVerified: false
        };

        console.log('Session after setting userData:', req.session);

        // Ensure the session is saved before sending the response
        req.session.save(async (err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ message: 'Error saving session', error: err.message });
            }

            await sendVerificationMail(email, otp);

            res.status(201).json({ message: 'User created. Please verify your email with the OTP sent.' });
        });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    console.log('Session at the start of verifyOtp:', req.session);

    try {
        const { otp } = req.body;

        // Check if session userData is set
        if (!req.session.user) {
            console.log('Session userData is undefined');
            return res.status(400).json({ message: 'Session expired or invalid. Please register again.' });
        }

        console.log('Session userData:', req.session.user);

        const {
            username,
            email,
            password,
            age,
            gender,
            height,
            weight,
            fitnessGoals,
            workoutLevel
        } = req.session.user;

        // Verify that the email in the request matches the one in the session
        if (email !== req.session.user.email) {
            return res.status(400).json({ message: 'Email mismatch. Please try again.' });
        }

        const otpDoc = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!otpDoc || otpDoc.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Create a new user
        const user = new UserData({
            username,
            email,
            password,
            age,
            gender,
            height,
            weight,
            fitnessGoals,
            workoutLevel,
            isVerified: true // Set isVerified to true upon successful registration
        });

        await user.save();
        await OTP.deleteOne({ _id: otpDoc._id });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        user.lastLogin = Date.now();
        await user.save();

        // Clear the session data after successful verification
        req.session.userData = null;
        req.session.save((err) => {
            if (err) {
                console.error('Error clearing session:', err);
            }
            res.json({ token });
        });
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserData.findOne({ email: email.toLowerCase() });
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

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        user.lastLogin = Date.now();
        await user.save();

        await sendLoginNotification(email, 'Your login was successful.');

        res.json({ token });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, verifyOtp };