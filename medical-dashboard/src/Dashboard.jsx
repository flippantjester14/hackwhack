import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Heart,
  Thermometer,
  Brain,
  Moon,
  MessageCircle,
  LogOut,
  Sun,
} from "lucide-react";
import Chatbot from "./Chatbot"; // Import the Chatbot component

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false); // For toggling Chatbot
  const [healthData, setHealthData] = useState({
    spo2: "--",
    heartRate: "--",
    temperature: "--",
    stressLevel: "--",
    bloodPressure: "--",
  });
  const [weather, setWeather] = useState(null);

  // Function to generate random time series data for charts
  const generateTimeSeriesData = (min, max, count = 24) => {
    return Array.from({ length: count }, (_, i) => ({
      time: `${i}:00`,
      value: (min + Math.random() * (max - min)).toFixed(1),
    }));
  };

  const [chartData, setChartData] = useState({
    spo2: [],
    heartRate: [],
    temperature: [],
    stressLevel: [],
    bloodPressure: [],
  });

  // Update health data and charts every 3 seconds
  useEffect(() => {
    if (showGraphs) {
      const interval = setInterval(() => {
        setHealthData({
          spo2: (95 + Math.random() * 4).toFixed(1),
          heartRate: (60 + Math.random() * 40).toFixed(0),
          temperature: (36 + Math.random() * 2).toFixed(1),
          stressLevel: (1 + Math.random() * 6).toFixed(1),
          bloodPressure: (110 + Math.random() * 20).toFixed(0),
        });

        setChartData({
          spo2: generateTimeSeriesData(95, 99),
          heartRate: generateTimeSeriesData(60, 100),
          temperature: generateTimeSeriesData(36, 38),
          stressLevel: generateTimeSeriesData(1, 7),
          bloodPressure: generateTimeSeriesData(110, 130),
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [showGraphs]);

  // Fetch weather data for Bangalore
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `http://api.weatherstack.com/current?access_key=b284cee0454bd1cfb755deff740f4d25&query=Bangalore`
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();

    const interval = setInterval(fetchWeather, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, data, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[300px]">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div
      className={`min-h-screen w-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="flex flex-col h-full w-full px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold">Medical Dashboard</h1>

          <div className="flex items-center gap-4">
            <select className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Moon className="h-5 w-5" />
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </nav>

        {/* Weather Widget */}
        <div className="flex justify-end mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-500" /> Weather in Bangalore
            </h3>
            {weather && weather.current ? (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Temperature:{" "}
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {weather.current.temperature}°C
                  </span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Weather:{" "}
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {weather.current.weather_descriptions[0]}
                  </span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Humidity:{" "}
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {weather.current.humidity}%
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading weather data...
              </p>
            )}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="SPO2"
            value={healthData?.spo2 || "--"}
            icon={Activity}
            color="text-blue-500"
          />
          <StatCard
            title="Heart Rate"
            value={healthData?.heartRate || "--"}
            icon={Heart}
            color="text-red-500"
          />
          <StatCard
            title="Temperature"
            value={healthData?.temperature || "--"}
            icon={Thermometer}
            color="text-yellow-500"
          />
          <StatCard
            title="Stress Level"
            value={healthData?.stressLevel || "--"}
            icon={Brain}
            color="text-purple-500"
          />
          <StatCard
            title="Blood Pressure"
            value={healthData?.bloodPressure || "--"}
            icon={Activity}
            color="text-green-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowGraphs(true)}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Conduct Evaluation
          </button>
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" /> Chat with Bot
          </button>
        </div>

        {/* Charts */}
        {showGraphs && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ChartCard title="SPO2 Levels" data={chartData.spo2} color="#3b82f6" />
            <ChartCard title="Heart Rate" data={chartData.heartRate} color="#ef4444" />
            <ChartCard title="Temperature" data={chartData.temperature} color="#eab308" />
            <ChartCard title="Stress Level" data={chartData.stressLevel} color="#8b5cf6" />
            <ChartCard title="Blood Pressure" data={chartData.bloodPressure} color="#22c55e" />
          </div>
        )}

        {/* Chatbot */}
        {showChatbot && <Chatbot />}
      </div>
    </div>
  );
};

export default Dashboard;
