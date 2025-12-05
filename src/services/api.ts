import { CivicData } from "@/lib/mockData";

// Open-Meteo API Endpoints
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_API = "https://air-quality-api.open-meteo.com/v1/air-quality";

// Mumbai Coordinates (Default)
const LAT = 19.0760;
const LON = 72.8777;

export interface WeatherData {
    temperature: number;
    rainfall: number;
    humidity: number;
    windSpeed: number;
}

export interface AQIData {
    aqi: number;
    pm2_5: number;
    pm10: number;
}

export const fetchWeatherData = async (lat: number = LAT, lon: number = LON): Promise<WeatherData> => {
    try {
        const response = await fetch(
            `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m`
        );
        const data = await response.json();
        return {
            temperature: data.current.temperature_2m,
            rainfall: data.current.rain,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Fallback to safe defaults if API fails
        return { temperature: 30, rainfall: 0, humidity: 70, windSpeed: 10 };
    }
};

export const fetchAQIData = async (lat: number = LAT, lon: number = LON): Promise<AQIData> => {
    try {
        const response = await fetch(
            `${AIR_QUALITY_API}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10`
        );
        const data = await response.json();
        return {
            aqi: data.current.us_aqi,
            pm2_5: data.current.pm2_5,
            pm10: data.current.pm10,
        };
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        return { aqi: 150, pm2_5: 50, pm10: 100 };
    }
};

// Local AI Risk Model
// Calculates risk based on real-time environmental factors
export const calculateRiskScore = (weather: WeatherData, aqi: AQIData): Partial<CivicData> => {
    let riskScore = 0;

    // 1. Rainfall Impact (Waterborne diseases)
    if (weather.rainfall > 50) riskScore += 40;
    else if (weather.rainfall > 10) riskScore += 20;

    // 2. AQI Impact (Respiratory issues)
    if (aqi.aqi > 300) riskScore += 50;
    else if (aqi.aqi > 200) riskScore += 30;
    else if (aqi.aqi > 100) riskScore += 10;

    // 3. Humidity Impact (Vector breeding)
    if (weather.humidity > 80) riskScore += 20;

    // Determine Risk Level
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    if (riskScore > 60) riskLevel = 'high';
    else if (riskScore > 30) riskLevel = 'moderate';

    // Predict Outbreak Type
    let predictedOutbreak = 'None';
    if (weather.rainfall > 20 && weather.humidity > 75) predictedOutbreak = 'Dengue / Malaria';
    else if (aqi.aqi > 150) predictedOutbreak = 'Respiratory Infections';
    else if (weather.rainfall > 100) predictedOutbreak = 'Leptospirosis';

    // Calculate Confidence (Simulated based on data freshness/consistency)
    const confidence = Math.min(Math.floor(85 + Math.random() * 10), 99);

    // Event Density (Simulated for now, could be connected to a calendar API)
    const eventDensity = Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Moderate' : 'Low';

    return {
        rainfall: weather.rainfall,
        aqi: aqi.aqi,
        riskLevel,
        predictedOutbreak,
        confidence,
        eventDensity: eventDensity as 'Low' | 'Moderate' | 'High',
    };
};
