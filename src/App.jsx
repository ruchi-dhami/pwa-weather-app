import React, { useState } from "react";
import { fetchWeather } from "./api/fetchWeather";
import { useUnit} from "./unitContext";


const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [searches, setSearches] = useState([]);

  const { unit, toggleUnit } = useUnit();

  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(cityName);
      setWeatherData(data);

      setSearches((prev) =>
        prev.includes(cityName) ? prev : [cityName, ...prev]
      );

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

    const fetchData = async (e) => {
      if (e.key === "Enter") {
        await fetchWeatherData(cityName.trim());
        setCityName("");
      }
    };
  
    const handleRecentSearchClick = async (city) => {
      await fetchWeatherData(city);
    };

    const displayTemperature = () => {
      if (!weatherData) return null;
  
      const tempC = weatherData.current.temp_c;
      const tempF = weatherData.current.temp_f;
  
      return unit === "C" ? `${tempC} °C` : `${tempF} °F`;
    };


  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={fetchData}
      />

      { loading && <div>Loading...</div> }
      { error && <div style={{ color: "red" }}>{error}</div>}

      
      { weatherData && !loading && (
        <div>
          <h2>
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          {/* <p>
            Temperature: {weatherData.current.temp_c} °C (
            {weatherData.current.temp_f} °F)
          </p> */}
          <div>
          <p>Temperature: { displayTemperature() }
              <button onClick={toggleUnit}>
                Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
              </button>
          </p> 
          </div>
          <p>Condition: {weatherData.current.condition.text}</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <p>Humidity: {weatherData.current.humidity}</p>
          <p>Pressure: {weatherData.current.pressure_mb}</p>
          <p>Visibility: {weatherData.current.vis_km}</p>
        </div>
      )}

      {searches.length > 0 && (
        <div>
          <h3>Recent Searches</h3>
          <ul>
            {searches.map((city, index) => (
              <li key={index}>
                <button onClick={() => handleRecentSearchClick(city)}>
                  {city}
                </button>
              </li>
            ))}
          </ul>
      </div>
      )}
    </div>
  );
};

export default App;
