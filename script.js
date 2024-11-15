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
  const maxPoints = Math.max(...points);

  // Chart dimensions and padding
  const padding = 40;
  const chartWidth = ctx.canvas.width - (padding * 2);
  const chartHeight = ctx.canvas.height - (padding * 2);
  const barWidth = (chartWidth / teams.length) * 0.8;
  const spacing = (chartWidth / teams.length) * 0.2;

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Team colors
  const teamColors = {
    'Mercedes': '#00D2BE',
    'Red Bull': '#0600EF',
    'Ferrari': '#DC0000',
    'McLaren': '#FF8700',
    'Alpine': '#0090FF',
    'AlphaTauri': '#2B4562',
    'Aston Martin': '#006F62',
    'Williams': '#005AFF',
    'Alfa Romeo': '#900000',
    'Haas': '#FFFFFF'
  };

  // Draw axes
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, chartHeight + padding);
  ctx.lineTo(chartWidth + padding, chartHeight + padding);
  ctx.strokeStyle = '#333';
  ctx.stroke();

  // Draw bars and labels
  teams.forEach((team, i) => {
    const x = padding + (i * (barWidth + spacing));
    const barHeight = (points[i] / maxPoints) * chartHeight;
    const y = chartHeight + padding - barHeight;

    // Draw bar
    ctx.fillStyle = teamColors[team] || '#999';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw team name
    ctx.save();
    ctx.translate(x + barWidth/2, chartHeight + padding + 10);
    ctx.rotate(-Math.PI / 4);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(team, 0, 0);
    ctx.restore();

    // Draw points
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';
    ctx.fillText(points[i], x + barWidth/2, y - 5);
  });

  // Draw scale
  for(let i = 0; i <= 5; i++) {
    const y = chartHeight + padding - (i * chartHeight/5);
    const points = Math.round((i * maxPoints/5));
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    ctx.fillText(points, padding - 5, y + 4);
  }
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
