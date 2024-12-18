// --- auth.js ---
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./user');
const rateLimit = require('express-rate-limit');
 // User model

// User Registration
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body; // role can be 'user', 'admin', 'organizer'
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.token);
        req.userId = decoded.userId; 
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ error: 'Token is invalid. Please log in.' });
    }
};

exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.'
}


module.exports = authMiddleware;
