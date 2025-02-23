const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if(!username || !password || !email){
            return res.status(400).json({ message: 'All fields are required' });
        }
        //Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format eg : john@example.com' });
        }
        //password length and complexity
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character' });
        }
        //Check if user already exists
        const existingUser = await User.findOne({ email});
        const existingUser1 = await User.findOne({ username });
        if (existingUser && existingUser1) {
            return res.status(400).json({ message: `User with email ${email} and username ${username} already exists` });
        }else if (existingUser1) {
            return res.status(400).json({ message: `User with username ${username} already exists` });
        }else if (existingUser) {
            return res.status(400).json({ message: `User with email ${email} already exists` });
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, password: hashedPassword, email });
            await user.save();
            res.status(201).json({ message:`User ${username} registered successfully` });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal server error ${error}` });
    }
});

router.post('/login', async (req, res) => {
    try {
        const alreadyLoggedIn = req.session.user;
        const { username, password } = req.body;
        if (!username  && !password){
            return res.status(400).json({ message: 'Provide username and password please' });
        }else if(!password){
            return res.status(400).json({ message: 'Provide password please' });
        }else if(!username){
            return res.status(400).json({ message: 'Provide username please' });
        }
        const user = await User.findOne({ username });
        
        if (user === null ) {
            return res.status(401).json({ message: `User with username ${username} not found` });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({ message: 'Invalid password' });
        }else if(alreadyLoggedIn){
            return res.status(400).json({ message: 'User already logged in' });
        }else{
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
            req.session.user = user;
            res.cookie('session', token, { httpOnly: true, secure: true, maxAge: 3600000 });
            res.header('Authorization', `Bearer ${token}`);
            res.status(200).json({ message: 'Login successful'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
    if(req.session.user){
        req.session.destroy();
        res.clearCookie('session', { httpOnly: true, secure: true });
        res.status(200).json({ message: 'Logout successful' });
    }else{
        res.status(400).json({ message: 'User not logged in' });
    }
});

module.exports = router;