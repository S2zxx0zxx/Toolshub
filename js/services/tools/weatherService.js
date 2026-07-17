export const WeatherService = (() => {
  
  // Using Open-Meteo Geocoding API to resolve city to coordinates
  const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
  // Using Open-Meteo Weather API
  const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

  async function getWeather(city) {
    if (!city) throw new Error("City parameter is required.");

    try {
      // 1. Geocoding
      const geoRes = await fetch(`${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      if (!geoRes.ok) throw new Error("Geocoding service unavailable.");
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`City not found: ${city}`);
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Weather Data
      const weatherRes = await fetch(`${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      if (!weatherRes.ok) throw new Error("Weather service unavailable.");
      const weatherData = await weatherRes.json();

      return {
        location: `${name}, ${country}`,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        time: weatherData.current_weather.time
      };

    } catch (e) {
      console.error("WeatherService Error:", e);
      throw new Error(e.message || "Weather service temporarily unavailable.");
    }
  }

  return {
    getWeather
  };
})();
