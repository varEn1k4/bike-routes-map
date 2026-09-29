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

const estimateMinutes = (km) => Math.round((km / 15) * 60);

let totalLength = 0;

// Use "of" to iterate over the array elements. In this case, 3 times
for (let route of routesData) {
  totalLength += route.km;

  // Estimate time in minutes for the current route
  //let timeInMinutes = estimateMinutes(route.km);
}

//Code for Task 7
//Calculate the total length of all static routes int html
const staticCards = document.querySelectorAll(".routes");
for (let card of staticCards) {
  card.remove();
}
//Searching the element with the id "routes-list"
const listContainer = document.querySelector("#routes-list");

function renderRoutes(routesData) {
  for (let element of routesData) {
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
}

renderRoutes(routesData);

//Calculate the total length of all routes
const totalKmElement = document.querySelector("#total-km");
if (totalKmElement) {
  totalKmElement.textContent = `Загальна довжина маршрутів: ${totalLength} км`;
}
