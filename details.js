const detailsDiv = document.getElementById("details");
const api = "https://api.tvmaze.com/shows/";

// Gaunu prieiga prie narsykles dabarrtines nuorodos
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
const movieCastApi = `${api}${movieId}/cast`;
const castDiv = document.getElementById("cast");

function getShowDetails() {
  fetch(`${api}${movieId}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      detailsDiv.innerHTML = `
    <h1>${data.name}</h1>
    ${data.image ? `<img src="${data.image.original}" class="showImg" alt="nuotrauka">` : ""}
    <p><strong>Reitingas:</strong>${data.rating.average ?? "Nera"}</p>
    <p>${data.summary}</p>
    `;
    });
}

function getCastDetails() {
  fetch(movieCastApi)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((actor) => {
        console.log(data);
        const div = document.createElement("div");
        div.className = "castCard";

        div.innerHTML = `
        ${actor.person.image && actor.person.image.medium ? `<img src="${actor.person.image.medium}" alt="nuotrauka">` : ""}
        <h4>${actor.person.name}</h4>
        <p>as ${actor.character.name}</p>
        `;

        castDiv.appendChild(div);

        div.addEventListener("click", () => {
          window.location.href = `actors.html?id=${actor.person.id}`;
        });
      });
    });
}

getShowDetails();
getCastDetails();
