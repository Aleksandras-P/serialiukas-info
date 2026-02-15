const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const statusText = document.getElementById("status");
const allShowsApi = "https://api.tvmaze.com/shows";
const searchShows = "https://api.tvmaze.com/search/shows?q=";
const adsDiv = document.getElementById("ads");
let isLoaded = false;

const adsDataBase = [
  {
    id: 1,
    name: "Vilnius Coding School",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa tenetur ipsum sint quae facilis temporibus dicta voluptatibus, et, fuga culpa porro delectus? Aperiam harum quibusdam illo nam sint quae dicta.",
    image: "/imgs/vilniusCoding.jpg",
    href: "https://www.vilniuscoding.lt",
  },
  {
    id: 2,
    name: "Amazon",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa tenetur ipsum sint quae facilis temporibus dicta voluptatibus, et, fuga culpa porro delectus? Aperiam harum quibusdam illo nam sint quae dicta.",
    image: "/imgs/amazon.jpg",
    href: "https://www.amazon.com",
  },
  {
    id: 3,
    name: "Netflix",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa tenetur ipsum sint quae facilis temporibus dicta voluptatibus, et, fuga culpa porro delectus? Aperiam harum quibusdam illo nam sint quae dicta.",
    image: "/imgs/netflix.jpg",
    href: "https://www.netflix.com",
  },
  {
    id: 0,
    name: "Vieta Jūsų reklamai",
    image: "",
    heading: "Vieta jūsų reklamai!",
    text: "Užsakykite reklamą savo verslui pas mus ir galėsime ją patalpinti viename iš pasirinktų mūsų aptarnaujamų puslapių. Puslapių sąrašą galėsite pamatyti, paspaudę mygtuką žemiau",
    href: "",
  },
];

// Ads loader

function loadAds() {
  const backgroundShadow = "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))";
  adsDataBase.forEach((ad) => {
    const div = document.createElement("div");
    div.className = "ad-card";
    if (ad.id === 0) {
      div.innerHTML = `
      <h2>${ad.heading}</h2>
      <p>${ad.text}</p> 
      <button class="adsBtn">Sužinoti plačiau</button>
      `;
      div.style.cursor = "default";
      const adsBtn = div.querySelector("button");
      adsBtn.addEventListener("click", () => {
        window.location.href = ad.href;
      });
    } else {
      div.style.background = `${backgroundShadow}, url("${ad.image}")`;
      div.innerHTML = `
      <h2>${ad.name}</h2>
      <p>${ad.text}</p> 
      `;
      div.addEventListener("click", () => {
        window.open(ad.href, "_blank").focus();
      });
    }
    adsDiv.appendChild(div);
  });
  startCarousel();
}

function startCarousel() {
  const carouselItems = document.querySelectorAll(".ad-card");
  let i = 1;

  setInterval(() => {
    Array.from(carouselItems).forEach((item, index) => {
      if (i < carouselItems.length) {
        item.style.transform = `translateX(-${i * 100}%)`;
      }
    });

    if (i < carouselItems.length) {
      i++;
    } else {
      i = 0;
    }
  }, 4000);
}

//ShowsLoader

function getAllShows() {
  resultsDiv.innerHTML = "";
  statusText.textContent = "Kraunami filmai...";
  fetch(allShowsApi)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      statusText.textContent = `Užkrauta ${data.length} serialų`;
      renderPages(data);
    })
    .catch((error) => {
      console.log(error);
      statusText.textContent =
        "Atsiprašome įvyko klaida, mėginkite dar kartą vėliau...";
    });
}

function searchShowsByName(value) {
  statusText.textContent = "Ieškoma...";
  resultsDiv.innerHTML = "";
  fetch(searchShows + value)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const shows = data.map((item) => item.show);

      statusText.textContent = `Surasta ${data.length} serialų`;
      shows.forEach((show) => {
        renderShows(show);
      });
    })
    .catch((error) => {
      console.log(error);
      statusText.textContent = "Deja filmu nerasta";
    });
}

function renderShows(show) {
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
        ${show.image && show.image.medium ? `<img src="${show.image.medium}" alt="nuotrauka">` : ""}
        <h3>${show.name}</h3>
        <p>${ratingResult}</p>
        `;
  div.addEventListener("click", () => {
    // Leidzia zmogu nukreipti i kita puslapi arba i musu vidini puslapi
    window.location.href = `details.html?id=${show.id}`;
  });
  resultsDiv.appendChild(div);
}

// Pagination
const pageDiv = document.getElementById("page");
let page = 1;
const limit = 18;

function renderPages(shows) {
  const start = (page - 1) * limit;
  const end = page * limit;
  const itemsOnPage = shows.slice(start, end);
  const length = Array.from(shows).length;

  resultsDiv.innerHTML = ""; // Clear everything before rendering

  // Add each item to the container
  itemsOnPage.forEach((show) => {
    renderShows(show);
  });

  if (isLoaded) {
    return;
  } else {
    // Add pagination controls
    const pagination = document.createElement("div");
    pagination.classList.add("pagination");

    // Page number buttons
    for (let i = 1; i <= totalPages(length); i++) {
      pagination.appendChild(createPaginationButton(i, page === i));
    }

    // Add everything to DOM
    pageDiv.appendChild(pagination);

    isLoaded = true;
  }
}

function createPaginationButton(text) {
  const btn = document.createElement("button");
  btn.className = "pageBtn";
  btn.innerText = text;
  btn.value = text;

  if (text === 1) {
    btn.disabled = true;
  }

  btn.addEventListener("click", () => {
    document.querySelectorAll(".pageBtn").forEach((btn) => {
      btn.disabled = false;
    });
    page = btn.value;
    btn.disabled = true;
    getAllShows();
  });

  return btn;
}

function totalPages(length) {
  return Math.ceil(length / limit);
}

//
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

getAllShows();

loadAds();
