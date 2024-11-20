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