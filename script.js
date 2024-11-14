document.addEventListener("DOMContentLoaded", () => {
  // Fetch teams from JSON and display
  if (document.querySelector("#teams-list")) {
    fetch("data/drivers.json")
      .then((response) => response.json())
      .then((data) => {
        const list = document.querySelector("#teams-list");
        data.teams.forEach((team) => {
          const li = document.createElement("li");
          li.textContent = `${team.name}: ${team.drivers.join(", ")}`;
          list.appendChild(li);
        });
      });
  }

  // Fetch circuits from JSON and display
  if (document.querySelector("#circuits-list")) {
    fetch("data/circuits.json")
      .then((response) => response.json())
      .then((data) => {
        const list = document.querySelector("#circuits-list");
        data.circuits.forEach((circuit) => {
          const li = document.createElement("li");
          li.textContent = circuit.name;
          list.appendChild(li);
        });
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const email = emailInput.value;

    // Regex pentru validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
      alert("Thank you for subscribing!");
      emailInput.value = ""; // Resetare câmp
    } else {
      alert("Please enter a valid email address.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const teamsGrid = document.getElementById("teams-grid");

  // Fetch team and driver data from a JSON file
  fetch("data/drivers.json")
    .then((response) => response.json())
    .then((data) => {
      data.teams.forEach((team) => {
        // Create a card for each team
        const teamCard = document.createElement("div");
        teamCard.className = "team-card";

        // Add team logo and name
        const teamLogo = document.createElement("img");
        teamLogo.src = team.logo;
        teamLogo.alt = `${team.name} Logo`;
        teamLogo.className = "team-logo";

        const teamName = document.createElement("h3");
        teamName.textContent = team.name;

        // Add driver list
        const driversList = document.createElement("ul");
        driversList.className = "drivers-list";
        team.drivers.forEach((driver) => {
          const driverItem = document.createElement("li");
          driverItem.textContent = driver;
          driversList.appendChild(driverItem);
        });

        // Append all elements to the team card
        teamCard.appendChild(teamLogo);
        teamCard.appendChild(teamName);
        teamCard.appendChild(driversList);

        // Append the team card to the grid
        teamsGrid.appendChild(teamCard);
      });
    })
    .catch((error) => console.error("Error fetching team data:", error));
});

document.addEventListener("DOMContentLoaded", () => {
  const circuitsGrid = document.getElementById("circuits-grid");
  const map = L.map("map").setView([0, 0], 2); // Initialize the map with a global view

  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Fetch circuit data from JSON and populate the grid
  fetch("data/circuits.json")
    .then((response) => response.json())
    .then((data) => {
      data.circuits.forEach((circuit) => {
        // Create a card for each circuit
        const circuitCard = document.createElement("div");
        circuitCard.className = "circuit-card";

        // Add circuit name and country
        const circuitName = document.createElement("h3");
        circuitName.textContent = circuit.name;

        const circuitCountry = document.createElement("p");
        circuitCountry.textContent = `Location: ${circuit.country}`;

        // Add circuit image
        const circuitImage = document.createElement("img");
        circuitImage.src = circuit.image;
        circuitImage.alt = `${circuit.name} Image`;
        circuitImage.className = "circuit-image";

        // Add a "View on Map" button
        const viewOnMapBtn = document.createElement("button");
        viewOnMapBtn.textContent = "View on Map";
        viewOnMapBtn.className = "btn";
        viewOnMapBtn.addEventListener("click", () => {
          map.setView([circuit.latitude, circuit.longitude], 12);
          L.marker([circuit.latitude, circuit.longitude])
            .addTo(map)
            .bindPopup(`<strong>${circuit.name}</strong><br>${circuit.country}`)
            .openPopup();
        });

        // Append elements to the circuit card
        circuitCard.appendChild(circuitImage);
        circuitCard.appendChild(circuitName);
        circuitCard.appendChild(circuitCountry);
        circuitCard.appendChild(viewOnMapBtn);

        // Append the circuit card to the grid
        circuitsGrid.appendChild(circuitCard);
      });
    })
    .catch((error) => console.error("Error fetching circuit data:", error));
});

document.addEventListener("DOMContentLoaded", () => {
  const standingsTable = document.querySelector("#standings-table tbody");
  const canvas = document.getElementById("team-chart");
  const ctx = canvas.getContext("2d");

  // Fetch stats data from JSON
  fetch("data/stats.json")
    .then((response) => response.json())
    .then((data) => {
      // Populate driver standings table
      data.drivers.forEach((driver, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${driver.name}</td>
          <td>${driver.team}</td>
          <td>${driver.points}</td>
        `;
        standingsTable.appendChild(row);
      });

      // Prepare data for the bar chart
      const teamPoints = {};
      data.drivers.forEach((driver) => {
        teamPoints[driver.team] = (teamPoints[driver.team] || 0) + driver.points;
      });

      drawBarChart(ctx, teamPoints);
    })
    .catch((error) => console.error("Error fetching stats data:", error));
});

// Function to draw a bar chart
function drawBarChart(ctx, teamPoints) {
  const teams = Object.keys(teamPoints);
  const points = Object.values(teamPoints);

  // Chart dimensions
  const chartWidth = ctx.canvas.width;
  const chartHeight = ctx.canvas.height;
  const barWidth = chartWidth / teams.length - 20;
  const maxPoints = Math.max(...points);
  const padding = 50;

  // Draw chart background
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(0, 0, chartWidth, chartHeight);

  // Draw bars
  teams.forEach((team, index) => {
    const barHeight = (points[index] / maxPoints) * (chartHeight - padding);
    const x = index * (barWidth + 20) + 20;
    const y = chartHeight - barHeight - padding;

    // Bar
    ctx.fillStyle = "rgba(75, 192, 192, 0.7)";
    ctx.fillRect(x, y, barWidth, barHeight);

    // Team name
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(team, x + barWidth / 2, chartHeight - 20);

    // Points
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(points[index], x + barWidth / 2, y - 10);
  });

  // Draw axes
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, chartHeight - padding);
  ctx.lineTo(chartWidth - 10, chartHeight - padding); // X-axis
  ctx.moveTo(padding, chartHeight - padding);
  ctx.lineTo(padding, 10); // Y-axis
  ctx.stroke();
}

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz-container");
  const nextButton = document.getElementById("next-question");
  const scoreDisplay = document.getElementById("score-display");

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;

  // Fetch quiz questions from JSON
  fetch("data/quiz.json")
    .then((response) => response.json())
    .then((data) => {
      questions = data.questions;
      loadQuestion();
    })
    .catch((error) => console.error("Error fetching quiz data:", error));

  // Load a question
  function loadQuestion() {
    quizContainer.innerHTML = ""; // Clear previous content
    const question = questions[currentQuestionIndex];

    // Display question text
    const questionText = document.createElement("h3");
    questionText.textContent = question.text;
    quizContainer.appendChild(questionText);

    // Display answer choices
    question.choices.forEach((choice, index) => {
      const choiceButton = document.createElement("button");
      choiceButton.className = "choice-btn";
      choiceButton.textContent = choice;
      choiceButton.addEventListener("click", () => handleAnswer(index, question.correct));
      quizContainer.appendChild(choiceButton);
    });
  }

  // Handle answer selection
  function handleAnswer(selectedIndex, correctIndex) {
    const buttons = document.querySelectorAll(".choice-btn");
    buttons.forEach((button, index) => {
      if (index === correctIndex) {
        button.style.backgroundColor = "green";
      } else if (index === selectedIndex) {
        button.style.backgroundColor = "red";
      }
      button.disabled = true;
    });

    // Update score if the answer is correct
    if (selectedIndex === correctIndex) {
      score++;
      scoreDisplay.textContent = score;
    }

    // Enable the "Next Question" button
    nextButton.disabled = false;
  }

  // Move to the next question
  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
      nextButton.disabled = true;
    } else {
      showFinalScore();
    }
  });

  // Show final score
  function showFinalScore() {
    quizContainer.innerHTML = `
      <h3>Quiz Complete!</h3>
      <p>Your final score is ${score} out of ${questions.length}.</p>
    `;
    nextButton.style.display = "none";
  }
});
