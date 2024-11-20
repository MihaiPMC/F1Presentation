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