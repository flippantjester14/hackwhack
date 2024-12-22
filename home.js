// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    console.log("Switched to Dark Mode");
  } else {
    console.log("Switched to Light Mode");
  }
});

// Simulated Live Data
const simulateLiveData = () => ({
  spo2: (95 + Math.random() * 4).toFixed(1), // SPO2 between 95-99
  heartRate: (60 + Math.random() * 40).toFixed(0), // Heart Rate between 60-100
  temperature: (36 + Math.random() * 2).toFixed(1), // Temperature between 36-38
  stressLevel: (1 + Math.random() * 6).toFixed(1), // Stress Level between 1-7
  bloodPressure: (110 + Math.random() * 20).toFixed(0), // Blood Pressure between 110-130
});

// Function to Update Live Data in the Cards
function updateLiveData() {
  const data = simulateLiveData();
  document.getElementById("spo2-value").textContent = data.spo2;
  document.getElementById("heart-rate-value").textContent = data.heartRate;
  document.getElementById("temperature-value").textContent = data.temperature;
  document.getElementById("stress-level-value").textContent = data.stressLevel;
  document.getElementById("blood-pressure-value").textContent =
    data.bloodPressure;
}

// Function to Generate Charts with Chart.js
function generateChart(ctx, label, data, color) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["15s", "30s", "45s"],
      datasets: [
        {
          label: label,
          data: data,
          borderColor: color,
          backgroundColor: color,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (seconds)",
          },
        },
        y: {
          title: {
            display: true,
            text: label,
          },
        },
      },
    },
  });
}

// Function to Update Graphs
function updateGraphs() {
  const spo2Data = [
    (95 + Math.random() * 4).toFixed(1),
    (95 + Math.random() * 4).toFixed(1),
    (95 + Math.random() * 4).toFixed(1),
  ];
  const heartRateData = [
    (60 + Math.random() * 40).toFixed(0),
    (60 + Math.random() * 40).toFixed(0),
    (60 + Math.random() * 40).toFixed(0),
  ];
  const temperatureData = [
    (36 + Math.random() * 2).toFixed(1),
    (36 + Math.random() * 2).toFixed(1),
    (36 + Math.random() * 2).toFixed(1),
  ];
  const stressLevelData = [
    (1 + Math.random() * 6).toFixed(1),
    (1 + Math.random() * 6).toFixed(1),
    (1 + Math.random() * 6).toFixed(1),
  ];
  const bloodPressureData = [
    (110 + Math.random() * 20).toFixed(0),
    (110 + Math.random() * 20).toFixed(0),
    (110 + Math.random() * 20).toFixed(0),
  ];

  generateChart(
    document.getElementById("spo2Chart").getContext("2d"),
    "SPO2 Levels",
    spo2Data,
    "#5e9ca0"
  );
  generateChart(
    document.getElementById("heartRateChart").getContext("2d"),
    "Heart Rate",
    heartRateData,
    "#5e9ca0"
  );
  generateChart(
    document.getElementById("temperatureChart").getContext("2d"),
    "Temperature",
    temperatureData,
    "#5e9ca0"
  );
  generateChart(
    document.getElementById("stressLevelChart").getContext("2d"),
    "Stress Levels",
    stressLevelData,
    "#5e9ca0"
  );
  generateChart(
    document.getElementById("bloodPressureChart").getContext("2d"),
    "Blood Pressure",
    bloodPressureData,
    "#5e9ca0"
  );
}

// Handle Evaluation Button
const evaluationBtn = document.getElementById("evaluationBtn");
evaluationBtn.addEventListener("click", () => {
  const graphsContainer = document.getElementById("graphsContainer");
  graphsContainer.classList.remove("hidden");

  // Simulate a 1-minute delay before showing data
  setTimeout(() => {
    updateLiveData(); // Update the data on cards
    updateGraphs(); // Generate graphs
    setInterval(() => {
      updateLiveData(); // Update cards every 15 seconds
      updateGraphs(); // Update graphs every 15 seconds
    }, 1000);
  }, 30000);
});

// Chat with Chatbot Button
const chatBtn = document.getElementById("chatBtn");
chatBtn.addEventListener("click", () => {
  alert("Chatbot feature coming soon!");
});

// Handle Logout Button
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  window.location.href = "index.html"; // Redirect to the login page
});

// Google Translate Integration
const languageSelector = document.getElementById("languageSelector");
languageSelector.addEventListener("change", async () => {
  const lang = languageSelector.value;
  const elementsToTranslate = document.querySelectorAll("h1, h2, h3, p, button");
  const textsToTranslate = Array.from(elementsToTranslate).map(
    (el) => el.innerText
  );

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: textsToTranslate, target: lang }),
      }
    );

    const data = await response.json();
    const translations = data.data.translations;

    elementsToTranslate.forEach((el, idx) => {
      el.innerText = translations[idx].translatedText;
    });
  } catch (error) {
    console.error("Translation Error:", error);
  }
});
