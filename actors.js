const actorDetailsDiv = document.getElementById("actorDetails");
const actorDetailsApi = "https://api.tvmaze.com/people/";
const actorShowsSectionDiv = document.getElementById("showsSection");

const params = new URLSearchParams(window.location.search);
const actorId = params.get("id");

function getActorDetails() {
  fetch(`${actorDetailsApi}${actorId}?embed=castcredits`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let lytis = "";
      if (data.gender === "Male") {
        lytis = "Vyras";
      } else if (data.gender === "Female") {
        lytis = "Moteris";
      }
      actorDetailsDiv.innerHTML = `
        <div class="actorDescription">
        <div>
        <h1>${data.name}</h1>
        ${data.image || data.image.original ? `<img src="${data.image.original}" alt="nuotrauka" class="actorImg">` : ""}
        </div>
        <div>
        <p>Gimė: ${data.birthday}</p>
        <p>Kilo iš: ${data.country.timezone}</p>
        <p>Lytis: ${lytis}</p>
        </div>
        </div>
        `;

      data._embedded.castcredits.forEach((shows) => {
        const showApi = shows._links.show.href;

        fetch(showApi)
          .then((showResponse) => {
            return showResponse.json();
          })
          .then((showData) => {
            const showCard = document.createElement("div");
            showCard.className = "actors-show-card";
            showCard.innerHTML = `
            ${showData.image || showData.image.medium ? `<img src="${showData.image.medium}" alt="nuotrauka" class="showImg">` : ""}
            <h4>${shows._links.show.name}</h4>
            <p>${shows._links.character.name}</p>

        `;

            showCard.addEventListener("click", () => {
              window.location.href = `details.html?id=${showData.id}`;
            });
            actorShowsSectionDiv.appendChild(showCard);
          });
      });
    });
}

getActorDetails();
