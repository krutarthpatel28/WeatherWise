# Weather Wise 🌤️

Weather Wise is a weather web application that allows users to search for current weather conditions by city or state. It provides detailed weather information, including temperature, humidity, wind speed, sunrise/sunset times, and a dynamically updated background that reflects the weather conditions.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [License](#license)

## Introduction
Weather Wise is a responsive weather app designed to provide accurate weather data for cities worldwide. It integrates the OpenWeatherMap API to fetch real-time weather information and displays it in a user-friendly interface with dynamic backgrounds and weather icons to enhance the user experience.

## Features
- 🌍 **Search weather by city**: Enter the name of a city to get current weather information.
- 🌡️ **Detailed weather data**: Includes temperature, feels-like temperature, maximum temperature, humidity, wind speed, and weather descriptions.
- 🌅 **Sunrise and Sunset times**: View the precise time of sunrise and sunset for your location.
- 🌄 **Dynamic background images**: Background changes based on the current weather condition (e.g., sunny, cloudy, rainy, snowy, windy, night).
- 👤 **User Login and Registration**: Allows users to create accounts, log in, and personalize their experience.
- 💬 **Weather Forum**: Users can post threads about weather conditions in their region and discuss with other users.

## Installation

To run this project locally, follow these steps:

### Prerequisites
- Node.js and npm must be installed on your machine.
- An API key from [OpenWeatherMap](https://openweathermap.org/api).

### Steps to install
1. **Clone the repository**:
    ```bash
    git clone https://github.com/krutarthpatel28/WeatherWise.git
    cd weather-wise
    ```

2. **Install dependencies**:
    Navigate to the project directory and install the required npm packages:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root of the project and add your OpenWeatherMap API key:
    ```bash
    API_KEY=your_openweather_api_key
    ```

4. **Run the app**:
    Start the server by running:
    ```bash
    npm start
    ```

    The app will run locally on `http://localhost:3000`.

## Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Enter a city name to fetch the weather data for that location.
3. The weather information will be displayed with the dynamic background, reflecting the current conditions.
4. Users can log in or register, access the forum, and participate in discussions about the weather.

## Technologies Used
- **Node.js**: Server-side JavaScript environment
- **Express.js**: Web framework for Node.js
- **EJS**: Templating engine for dynamic HTML rendering
- **Bootstrap**: Frontend framework for responsive design
- **CSS**: Custom styles for the app
- **OpenWeatherMap API**: API for fetching real-time weather data
- **MongoDB (optional)**: For storing user information and forum posts

## Project Structure
```
/WeatherWise
  ├── /models
  │   └── User.js
  ├── /public
  |   └── /styles
  |       └── style.css
  │   └── /images
  ├── /middleware
  │   └── authmiddleware.js
  ├── /views
  │   └── login.ejs
  │   └── home.ejs
  │   └── register.ejs
  │   └── index.ejs
  ├── .env
  ├── index.js
  ├── package.json
  └── posts.csv
```
## Contributors
- **Krutarth Patel** - Developer
- **Om Anoakar** - Database expert
- **Parshva Sambadiya** - Designer (UI/UX and logos)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Screenshots
#### Home Page
![WhatsApp Image 2024-10-21 at 02 01 31_66f23257](https://github.com/user-attachments/assets/13182a14-04f5-41b4-9b77-ca5a93c7493c)
![WhatsApp Image 2024-10-21 at 02 31 48_679cc9d1](https://github.com/user-attachments/assets/6a799c02-fcf0-429c-a701-79a58aa7c737)
![image](https://github.com/user-attachments/assets/bc64aff5-a8e2-4e69-ae76-f71a89dcba9c)
![image](https://github.com/user-attachments/assets/e276d874-fdab-42e0-8171-89f27bf87f55)
![image](https://github.com/user-attachments/assets/32e15be8-8c0f-4db8-aad7-978ba02b5c34)
![image](https://github.com/user-attachments/assets/deea6347-6c7c-4368-b15b-3e652203df53)


---

Thank you for using **WeatherWise**! Feel free to contribute to the project by submitting a pull request or opening an issue.
