document.addEventListener("DOMContentLoaded", () => {
  const circuitsGrid = document.getElementById("circuits-grid");
  const circuitInfo = document.getElementById("circuit-info");

  // Fetch circuit data from JSON and populate the grid
  fetch("data/circuits.json")
    .then((response) => response.json())
    .then((data) => {
      data.circuits.forEach((circuit) => {
        const circuitCard = document.createElement("div");
        circuitCard.className = "circuit-card";

        const circuitName = document.createElement("h3");
        circuitName.textContent = circuit.name;

        const circuitCountry = document.createElement("p");
        circuitCountry.textContent = `Location: ${circuit.country}`;

        const circuitImage = document.createElement("img");
        circuitImage.src = circuit.image;
        circuitImage.alt = `${circuit.name} Image`;
        circuitImage.className = "circuit-image";

        const viewDetailsBtn = document.createElement("button");
        viewDetailsBtn.textContent = "View Details";
        viewDetailsBtn.className = "btn";
        viewDetailsBtn.addEventListener("click", () => {
          circuitInfo.innerHTML = `
            <h3>${circuit.name}</h3>
            <p>Country: ${circuit.country}</p>
            <p>Length: ${circuit.length}</p>
            <p>Number of Laps: ${circuit.laps}</p>
            <p>First Grand Prix: ${circuit.firstGP}</p>
          `;
        });

        circuitCard.appendChild(circuitImage);
        circuitCard.appendChild(circuitName);
        circuitCard.appendChild(circuitCountry);
        circuitCard.appendChild(viewDetailsBtn);

        circuitsGrid.appendChild(circuitCard);
      });
    })
    .catch((error) => console.error("Error fetching circuit data:", error));
});
