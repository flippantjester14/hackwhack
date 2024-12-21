// Dark Mode Toggle
const themeSwitcher = document.getElementById("themeSwitcher");
themeSwitcher.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeSwitcher.textContent = "Switch to Light Mode";
  } else {
    themeSwitcher.textContent = "Switch to Dark Mode";
  }
});

// Simulated Data
const simulateLiveData = () => ({
  spo2: (95 + Math.random() * 4).toFixed(1),
  heartRate: (60 + Math.random() * 40).toFixed(0),
  temperature: (36 + Math.random() * 2).toFixed(1),
  stressLevel: (1 + Math.random() * 6).toFixed(1),
  bloodPressure: (110 + Math.random() * 20).toFixed(0),
});

// Update Live Data
function updateLiveData() {
  const data = simulateLiveData();
  document.getElementById("spo2-value").textContent = data.spo2;
  document.getElementById("heart-rate-value").textContent = data.heartRate;
  document.getElementById("temperature-value").textContent = data.temperature;
  document.getElementById("stress-level-value").textContent = data.stressLevel;
  document.getElementById("blood-pressure-value").textContent =
    data.bloodPressure;
}

// Handle Evaluation
const evaluationBtn = document.getElementById("evaluationBtn");
evaluationBtn.addEventListener("click", () => {
  setTimeout(() => {
    document.getElementById("graphsContainer").classList.remove("hidden");
    updateLiveData();
    setInterval(updateLiveData, 15000);
  }, 60000); // 1-minute delay
});
