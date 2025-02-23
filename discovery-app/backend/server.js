require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port =  5000;
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const User = require('./models/user');
app.use(express.json());
app.use(cors());
const session = require('express-session');
const secret = process.env.JWT_SECRET;
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

const uri = process.env.MONGODB_URL;

const mongoose = require('mongoose');
mongoose.connect(uri, {retryWrites: false}).then(() => {
    console.log('Connected to MongoDB successfuly');
}).catch(err => {
    console.log(err);
});
app.get('/', (req, res) => {
    res.send('API is running');
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})