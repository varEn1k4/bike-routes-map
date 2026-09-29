const routesData = [
  {
    name: "Веломаршрут 1",
    km: 32,
    difficulty: "легка",
  },
  {
    name: "Веломаршрут 2",
    km: 57,
    difficulty: "середня",
  },
  {
    name: "Веломаршрут 3",
    km: 86,
    difficulty: "складна",
  },
];

//CONSTANTS FOR TASK 7
const staticCards = document.querySelectorAll(".routes");
const listContainer = document.querySelector("#routes-list");
const totalKmElement = document.querySelector("#total-km");
//CONSTANTS FOR TASK 8
const form = document.querySelector("#add-route-form");
const kmInput = document.querySelector("#route-km");
const selectedRouteDifficulty = document.querySelector("#filter-difficulty");

//START OF TASK 7
for (let card of staticCards) {
  card.remove();
}

function renderRoutes(routesData) {
  listContainer.innerHTML = ""; //Clear the container before rendering new routes
  let currentTotalLength = 0; //Reset total length for recalculation

  for (let element of routesData) {
    currentTotalLength += element.km;

    //Create a new article element for each route
    let route = document.createElement("article");
    route.classList.add("routes");

    //Create and append the title and details for each route
    let title = document.createElement("h3");
    title.textContent = element.name;

    let details = document.createElement("p");
    details.textContent = `${element.km} км, ${element.difficulty}`;

    //Set the data-km attribute for each route
    route.dataset.km = element.km;

    if (element.difficulty === "легка") {
      route.classList.add("easy");
    } else if (element.difficulty === "середня") {
      route.classList.add("medium");
    } else if (element.difficulty === "складна") {
      route.classList.add("hard");
    }

    //Append the title and details to the route article
    route.append(title, details);
    listContainer.append(route);
  }

  if (totalKmElement) {
    totalKmElement.textContent = `Загальна довжина маршрутів: ${currentTotalLength} км`;
  }
}

renderRoutes(routesData);
//END OF TASK 7

//START OF TASK 8
form.addEventListener("submit", (event) => {
  event.preventDefault();

  let nameInput = document.querySelector("#route-name").value;
  let kmInput = Number(document.querySelector("#route-km").value);
  let difficultyInput = document.querySelector("#filter-difficulty").value;

  let newRoute = {
    name: nameInput,
    km: kmInput,
    difficulty: difficultyInput,
  };

  // Add the new route to the routesData array
  routesData.push(newRoute);
  renderRoutes(routesData);
  form.reset();
});

//Check if kmInput is bigger than 300
kmInput.addEventListener("input", () => {
  if (Number(kmInput.value) > 300) {
    kmInput.setCustomValidity("Довжина маршруту не може перевищувати 300 км.");
  } else {
    kmInput.setCustomValidity("");
  }
});

//Filter routes
selectedRouteDifficulty.addEventListener("change", () => {
  let selectedOption = selectedRouteDifficulty.value;

  if (selectedOption === "всі") {
    renderRoutes(routesData);
  } else {
    let filteredRoutes = routesData.filter(
      (route) => route.difficulty === selectedOption,
    );
    renderRoutes(filteredRoutes);
  }
});
