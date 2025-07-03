// src/components/common/WeatherWidget.js

import React, { useEffect, useState } from "react";
import {
    WiDaySunny,
    WiCloudy,
    WiRain,
    WiSnow,
    WiFog,
    WiNa,
} from "react-icons/wi";
import { useLanguage } from "../../utils/languageContext";

const WeatherWidget = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(false);
    const { language } = useLanguage();

    const city = "Le Mans";
    const apiKey = process.env.GATSBY_OPENWEATHER_API_KEY;

    const translateCondition = (text) => {
        const normalized = text.toLowerCase();
        const translations = {
            "clear": { fr: "Dégagé", en: "Clear" },
            "sunny": { fr: "Ensoleillé", en: "Sunny" },
            "partly cloudy": { fr: "Partiellement nuageux", en: "Partly cloudy" },
            "cloudy": { fr: "Nuageux", en: "Cloudy" },
            "overcast": { fr: "Couvert", en: "Overcast" },
            "mist": { fr: "Brume", en: "Mist" },
            "fog": { fr: "Brouillard", en: "Fog" },
            "rain": { fr: "Pluie", en: "Rain" },
            "snow": { fr: "Neige", en: "Snow" },
        };
        return translations[normalized]?.[language] || text;
    };

    useEffect(() => {
        if (!apiKey) {
            console.warn("⚠️ La clé API météo GATSBY_OPENWEATHER_API_KEY est absente.");
            setError(true);
            return;
        }
    
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=${language}`
                );
                const data = await response.json();
                setWeatherData(data);
            } catch (err) {
                console.error("Erreur météo :", err);
                setError(true);
            }
        };
    
        fetchWeather();
    }, [language, apiKey]);
    

    const getWeatherIcon = (code) => {
        if (!code) return <WiNa />;
        if ([1000].includes(code)) return <WiDaySunny />;
        if ([1003, 1006, 1009].includes(code)) return <WiCloudy />;
        if ([1063, 1150, 1153, 1180, 1183, 1240].includes(code)) return <WiRain />;
        if ([1066, 1114, 1210, 1213, 1216, 1255].includes(code)) return <WiSnow />;
        if ([1030, 1135, 1147].includes(code)) return <WiFog />;
        return <WiNa />;
    };

    if (error) {
        return (
            <div className="weather-widget">
                ⚠️ {language === "fr" ? "Indispo météo" : "Weather unavailable"}
            </div>
        );
    }

    if (!weatherData) {
        return <div className="weather-widget">...</div>;
    }

    const { current } = weatherData;

    return (
        <div className="weather-widget">
            <span className="weather-location">{city}</span>
            <span className="weather-icon">{getWeatherIcon(current.condition.code)}</span>
            <span className="weather-temp">{current.temp_c}°C</span>
            <span className="weather-desc">{translateCondition(current.condition.text)}</span>
        </div>
            );
};

export default WeatherWidget;
