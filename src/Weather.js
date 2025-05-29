import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Weather = () => {
  const [city, setCity] = useState(null);
  const [inputCity, setInputCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [historical, setHistorical] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;

  const fetchWeather = async (selectedCity) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(url);
      setWeather(response.data);

      // Mock historical data
      const mockTemps = [];
      const labels = [];

      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        labels.push(day.toLocaleDateString("en-GB", { weekday: "short" }));
        const temp = response.data.main.temp + (Math.random() * 4 - 2);
        mockTemps.push(parseFloat(temp.toFixed(1)));
      }

      setHistorical({ labels, temperatures: mockTemps });
      setCity(selectedCity);
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("City not found. Please try again.");
      setWeather(null);
      setHistorical(null);
      setCity(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      fetchWeather(inputCity.trim());
    }
  };

  const chartData = historical && {
    labels: historical.labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: historical.temperatures,
        fill: false,
        borderColor: "blue",
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ width: "90%", maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Weather Dashboard</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>

      {weather && historical && city && (
        <>
          <h3>
            {weather.name}, {weather.sys.country}
          </h3>
          <p>
            <strong>Current Temp:</strong> {weather.main.temp}°C
          </p>
          <p>
            <strong>Condition:</strong> {weather.weather[0].description}
          </p>

          <h4>Temperature - Last 7 Days (Mock)</h4>
          <Line data={chartData} />
        </>
      )}
    </div>
  );
};

export default Weather;