import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';
import csv from 'csv-parser'; // To parse CSV files
import { userAuthVerification } from './middleware/authmiddleware.js';

dotenv.config();

import User from './models/User.js';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;
const POSTS_FILE = path.join(__dirname, 'posts.csv'); // Path to your CSV file
var USERNAME = "";

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

// Helper function to read posts from CSV
const readPostsFromCSV = () => {
    const posts = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(POSTS_FILE)
            .pipe(csv())
            .on('data', (row) => posts.push(row))
            .on('end', () => resolve(posts))
            .on('error', reject);
    });
};

// Helper function to write new post to CSV
const writePostToCSV = (post) => {
    const newLine = `"${post.title}","${post.description}","${post.content}","${post.username}","${post.createdAt}"\n`;
    return new Promise((resolve, reject) => {
        fs.appendFile(POSTS_FILE, newLine, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
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
    const { name, email, password, confirmPassword, createdAt } = req.body;

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
        
        // const hashedPassword = await bcrypt.hash(password, 12);
        

        const newUser = await User.create({ email, password, name, createdAt })
        const id = newUser._id;

        
        // const newUser = new User({
        //     name,
        //     email,
        //     password: hashedPassword
        // });
        // await newUser.create();
        
        const token = jwt.sign({id}, process.env.JWT_SECRET, {
            expiresIn: 3 * 24 * 60 * 60
        })
        res.cookie("token", token, {
            withCredential: true,
            httpOnly: false,
        })

        res.status(201).redirect('/');
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    try {
    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    USERNAME = user.name;
    
    if (!user) {
        return res.status(400).json({ message: "User not found." });
    }
    
    if(!password){
        return res.json({ status:false })
    }

    const auth = await bcrypt.compare(password, user.password)
    if(!auth){
        return res.json({ message: 'Incorrect password or email '})
    }

    const id = user._id;
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    })
    res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
    });
    res.status(201).redirect('/home');
    } catch (error) {
        console.log(error);
    }
        // const isMatch = await bcrypt.compare(password, user.password);
        // console.log("Password match:", isMatch);

        // if (!isMatch) {
        //     return res.status(400).json({ message: "Invalid password." });
        // }

        // const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        // res.cookie('token', token, { httpOnly: true });
        // return res.status(200).json({ message: "Login successful", redirectUrl: '/home' });
    // } catch (error) {
    //     console.error("Error during login:", error);
    //     res.status(500).json({ message: "Server error", error: error.message });
    // }
});

app.get("/home", (req, res) => {
    res.render("home", { user: req.user }); 
});
// Weather route
app.post("/weather", async (req, res) => {
  const city = req.body.city;
  const country = "in"; // Assuming you're working with Indian cities
  const API_KEY = process.env.API_KEY;

  let backgroundImage = "/images/default.png"; // Default background image
  let weatherClass = "default"; // Default weather class

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    if (weatherData.cod === 200) {
      const {
        main: { temp, feels_like, humidity, temp_max },
        wind: { speed },
        name: cityName,
        weather,
        sys: { sunrise, sunset },
      } = weatherData;

      // Determine weather condition for class and background image
      const weatherCondition = weather[0].main.toLowerCase();
      const currentTime = Date.now() / 1000; // Get current time in seconds

      // Determine weather condition for class and background image
      if (currentTime < sunrise || currentTime > sunset) {
        weatherClass = "night";
        backgroundImage = "/images/Night.png"; // Night background
      } else {
        switch (
          true // Use switch with a true condition to check for multiple cases
        ) {
          case weatherCondition === "Clear":
            weatherClass = "sunny";
            backgroundImage = "/images/sunny.png"; // Set path for sunny image
            break;
          case [
            "few clouds",
            "scattered clouds",
            "broken clouds",
            "overcast clouds",'mist',
          ].includes(weatherCondition):
            weatherClass = "cloudy";
            backgroundImage = "/images/cloudy.png"; // Set path for cloudy image
            break;
          case [
            "light rain",
            "haze",
            "moderate rain",
            "heavy rain",
            "very heavy rain",
            "extreme rain",
            "freezing rain",
            "shower rain",
          ].includes(weatherCondition):
            weatherClass = "rainy";
            backgroundImage = "/images/rainy.png"; // Set path for rainy image
            break;
          case ["light snow", "moderate snow", "heavy snow", "sleet"].includes(
            weatherCondition
          ):
            weatherClass = "snowy";
            backgroundImage = "/images/snowy.png"; // Set path for snowy image
            break;
          case weatherCondition === "wind":
            weatherClass = "windy";
            backgroundImage = "/images/windy.png"; // Set path for windy image
            break;
          default:
            weatherClass = "windy"; // Fallback
            backgroundImage = "/images/windy.png"; // Default background
        }
      }

      const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
      const sunsetTime = new Date(sunset * 1000).toLocaleTimeString();

      res.render("index", {
        temperature: temp,
        feelsLike: feels_like,
        cityName,
        humidity,
        windSpeed: speed,
        maxTemp: temp_max,
        description: weather[0].description,
        sunriseTime,
        sunsetTime,
        textColor: `var(--${weatherClass}_color)`,
        weatherClass,
        backgroundImage,
      });
    } else {
      res.render("index", {
        error: "Could not fetch weather data for the city.",
        city,
        backgroundImage, // Pass the default background image on error
        weatherClass, // Pass the default weather class on error
      });
    }
  } catch (error) {
    console.error("Weather fetching error:", error);
    res.render("index", {
      error: "An error occurred while fetching data.",
      city,
      backgroundImage, // Pass the default background image on error
      weatherClass, // Pass the default weather class on error
    });
  }
});

app.get('/forum', async (req, res) => {
    try {
        const posts = await readPostsFromCSV();
        res.render('forum', { posts });
    } catch (error) {
        console.error("Error reading posts from CSV:", error);
        res.status(500).json({ message: "Could not load forum posts" });
    }
});

app.post('/forum/create-post', userVerification, async (req, res) => {
    const { title, description, content } = req.body;

    if (!title || !description || !content) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // const token = req.cookies.token;
    // const verifyCookie = async () => {
    //     if (!token) {
    //       navigate("/login");
    //     }
    //     const { data } = await userAuthVerification();
    //     const { status, user } = data;
    //     return user;
    // }

    
    const newPost = {
        title,
        description,
        content,
        username: USERNAME, // Assuming the user's email is stored in the JWT
        createdAt: new Date().toISOString(),
    };

    try {
        await writePostToCSV(newPost);
        res.redirect('/forum');
    } catch (error) {
        console.error("Error writing post to CSV:", error);
        res.status(500).json({ message: "Could not create post" });
    }
});

app.get('/about',(req,res)=>{
    res.render('about');
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.redirect('/');
});

connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server's up and running on port 3000");
    });
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
});