import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import User from './models/User.js';  

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));


const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT
const userVerification = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Invalid token." });
    }
};

// Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        
        // Log the created user for verification
        console.log("New user created:", newUser);
        res.status(201).redirect('/');
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    try {
        const user = await User.findOne({ email });
        console.log("User found:", user); 
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password from login form:", password);
        console.log("Hashed password from database:", user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Create JWT token and set it in cookies
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).redirect('/home');
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/home", userVerification, (req, res) => {
    res.render("home", { user: req.user }); 
});

// Weather route
app.post('/weather', userVerification, async (req, res) => {
    const city = req.body.city;
    const country = 'in';  // Assuming you're working with Indian cities
    const API_KEY = process.env.API_KEY;

    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === 200) {
            const {
                main: { temp, feels_like, humidity, temp_max },
                wind: { speed },
                name: cityName,
                weather,
                sys: { sunrise, sunset },
            } = weatherData;

            res.render('index', {
                temperature: temp,
                feelsLike: feels_like,
                cityName,
                humidity,
                windSpeed: speed,
                maxTemp: temp_max,
                description: weather[0].description,
                sunriseTime: new Date(sunrise * 1000).toLocaleTimeString(),
                sunsetTime: new Date(sunset * 1000).toLocaleTimeString(),
                precipitation: weather[0].main,
            });
        } else {
            res.render('index', { error: "Could not fetch weather data for the city.", city });
        }
    } catch (error) {
        console.error(error);
        res.render('index', { error: "An error occurred while fetching data.", city });
    }
});

// Forum route
app.get('/forum', userVerification, (req, res) => {
    res.render('forum');
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.redirect('/');
});

// Start server
app.listen(3000, () => {
    console.log("Server's up and running on port 3000");
});
