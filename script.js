const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const statusText = document.getElementById("status");
const allShowsApi = "https://api.tvmaze.com/shows";
const searchShows = "https://api.tvmaze.com/search/shows?q=";

function getAllShows() {
  resultsDiv.innerHTML = "";
  statusText.textContent = "Kraunami filmai...";
  fetch(allShowsApi)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      statusText.textContent = `Uzkrauta ${data.length} filmu`;
      data.forEach((show) => {
        const rating = show.rating.average;
        const noRating = "Reitingo duomenu nera";
        const ratingString = `Reitingas: ${rating} / 10`;
        let ratingResult = "";

        if (!rating) {
          ratingResult = noRating;
        } else {
          ratingResult = ratingString;
        }

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
        <img src="${show.image.medium}" alt="nuotrauka">
        <h3>${show.name}</h3>
        <p>${ratingResult}</p>
        `;
        div.addEventListener("click", () => {
          // Leidzia zmogu nukreipti i kita puslapi arba i musu vidini puslapi
          window.location.href = `details.html?id=${show.id}`;
        });
        resultsDiv.appendChild(div);
      });
    })
    .catch((error) => {
      console.log(error);
      statusText.textContent = "Atsiprasome ivyko klaida";
    });
}

getAllShows();

function searchShowsByName(value) {
  statusText.textContent = "Ieskoma...";
  resultsDiv.innerHTML = "";
  fetch(searchShows + value)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const shows = data.map((item) => item.show);
      console.log(shows);

      statusText.textContent = `Uzkrauta ${data.length} filmu`;
      shows.forEach((show) => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
        <img src="${show.image?.medium || ""}" alt="nuotrauka">
        <h3>${show.name}</h3>
        `;

        div.addEventListener("click", () => {
          // Leidzia zmogu nukreipti i kita puslapi arba i musu vidini puslapi
          window.location.href = `details.html?id=${show.id}`;
        });
        resultsDiv.appendChild(div);
      });
    })
    .catch((error) => {
      console.log(error);
      statusText.textContent = "Deja filmu nerasta";
    });
}

searchInput.addEventListener("keypress", (event) => {
  const value = searchInput.value;

  if (event.key === "Enter") {
    if (value.length >= 2) {
      searchShowsByName(value);
    } else if (!value) {
      getAllShows();
    }
  }
});

searchInput.addEventListener("input", () => {
  if (!searchInput.value) {
    getAllShows();
  }
});
