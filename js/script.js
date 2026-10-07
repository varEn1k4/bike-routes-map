//CONSTANTS FOR TASK 7
// const staticCards = document.querySelectorAll(".routes");
// const listContainer = document.querySelector("#routes-list");
const totalKmElement = document.querySelector("#total-km");
//CONSTANTS FOR TASK 8
// const form = document.querySelector("#add-route-form");
const kmInput = document.querySelector("#route-km");
const selectedRouteDifficulty = document.querySelector("#filter-difficulty");
//Constants for TASK 10
const DB_NAME = "RoutesDatabase";
const STORE_NAME = "routes";
const DB_VERSION = 1;
//CONSTANTS FOR TASK 12
// const canvas = document.querySelector("#routes-chart");
// const ctx = canvas.getContext("2d");
// CONSTANTS FOR TASK 13
const appContainer = document.querySelector("#app");
const routes = [
  { path: "#/", view: renderHomePage },
  { path: "#/route/:id", view: renderRouteDetailsPage },
  { path: "#/difficulty/:level", view: renderFilteredRoutesPage },
];

let routesData = [
  {
    id: 1,
    name: "Веломаршрут 1",
    distanceKm: 32,
    difficulty: "легка",
  },
  {
    id: 2,
    name: "Веломаршрут 2",
    distanceKm: 57,
    difficulty: "середня",
  },
  {
    id: 3,
    name: "Веломаршрут 3",
    distanceKm: 86,
    difficulty: "складна",
  },
];

//TASK 11 FUNCTIONS
function saveToLocalStorage(items) {
  try {
    localStorage.setItem("routes", JSON.stringify(items));
  } catch (error) {
    console.error("Помилка збереження даних у localStorage:", error);
  }
}

function loadFromLocalStorage() {
  try {
    const storedRoutes = localStorage.getItem("routes");
    if (storedRoutes) {
      return JSON.parse(storedRoutes);
    }
    return routesData; // Return default data if nothing is stored
  } catch (error) {
    console.error("Помилка завантаження даних з localStorage:", error);
    return routesData;
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);

    request.onerror = (event) => {
      console.error("IndexedDB недоступна", event.target.error);
      reject("Помилка відкриття бази даних");
    };
  });
}

async function addItem(item) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error("IndexedDB недоступна", event.target.error);
      reject("Помилка відкриття бази даних");
    };
  });
}

async function getAllItems() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function deleteItem(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}

async function migrateIfNeeded() {
  const isMigrated = localStorage.getItem("migrated");
  if (isMigrated) return;

  const localData = loadFromLocalStorage();
  if (localData.length > 0) {
    for (let route of localData) {
      await addItem(route);
    }
  }
  localStorage.setItem("migrated", "true");
}

async function initApp() {
  try {
    await migrateIfNeeded();
    routesData = await getAllItems();
    router();
  } catch (error) {
    console.error("Помилка ініціалізації додатку:", error);
    alert("Помилка ініціалізації додатку. База даних недоступна.");
  }
}

initApp();

//START OF TASK 7
function renderRoutes(routesData) {
  const listContainer = document.querySelector("#routes-list");
  const totalKmElement = document.querySelector("#total-km");

  if (!listContainer) {
    return;
  }

  listContainer.innerHTML = ""; //Clear the container before rendering new routes
  let currentTotalLength = 0; //Reset total length for recalculation

  for (let element of routesData) {
    currentTotalLength += element.distanceKm;

    //Create a new article element for each route
    let route = document.createElement("article");

    let detailsButton = document.createElement("button");
    detailsButton.classList.add("show-details-btn");
    detailsButton.type = "button";
    detailsButton.textContent = "Показати перепад висот";
    detailsButton.addEventListener("click", () => {
      window.location.hash = `#/route/${element.id}`;
    });
    route.append(detailsButton);

    route.classList.add("routes");

    //Create and append the title and details for each route
    let title = document.createElement("h3");
    title.textContent = element.name;

    let details = document.createElement("p");
    details.textContent = `${element.distanceKm} км, ${element.difficulty}`;

    //Set the data-km attribute for each route
    route.dataset.km = element.distanceKm;

    if (element.difficulty === "легка") {
      route.classList.add("easy");
    } else if (element.difficulty === "середня") {
      route.classList.add("medium");
    } else if (element.difficulty === "складна") {
      route.classList.add("hard");
    }

    //Append the title and details to the route article
    route.append(title, details, detailsButton);
    listContainer.append(route);
  }

  if (totalKmElement) {
    totalKmElement.textContent = `Загальна довжина маршрутів: ${currentTotalLength} км`;
  }
}

//TASK 12
//Function to create high points based on route distance and difficulty
function createHighPoints(route) {
  let pointsCount = Math.floor(route.distanceKm / 4);

  if (pointsCount < 2) {
    pointsCount = 2;
  }

  let maxHeight = 0;
  if (route.difficulty === "легка") {
    maxHeight = 30;
  } else if (route.difficulty === "середня") {
    maxHeight = 80;
  } else if (route.difficulty === "складна") {
    maxHeight = 140;
  }

  let highPoint = [];
  for (let i = 0; i < pointsCount; i++) {
    highPoint.push(Math.floor(Math.random() * maxHeight) + 1);
  }
  return highPoint;
}

let animationFrameId;
//Function to animate the route on the canvas
function animateRoute(route) {
  const canvas = document.querySelector("#routes-chart");
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext("2d");

  const highPoints = createHighPoints(route);
  let currentPoint = 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Function to draw the frame of the animation
  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - highPoints[0]);
    //Draw lines to each high point
    for (let i = 1; i <= currentPoint; i++) {
      let x = (canvas.width / (highPoints.length - 1)) * i;
      let y = canvas.height - highPoints[i];
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.stroke();
    //If there are more points to draw, request the next animation frame
    if (currentPoint < highPoints.length - 1) {
      currentPoint++;
      animationFrameId = requestAnimationFrame(drawFrame);
    }
  }
  //If there is an existing animation frame, cancel it before starting a new one
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  drawFrame();
}

//TASK 13

function renderHomePage() {
  appContainer.innerHTML = `
    <section id="routes">
      <h2>Маршрути</h2>
      <form id="add-route-form">
        <label for="route-name">Назва маршруту:</label>
        <input type="text" id="route-name" required />
        
        <label for="route-km">Довжина (км):</label>
        <input type="number" id="route-km" required min="0.1" step="any" />
        
        <label for="filter-difficulty">Складність:</label>
        <select id="filter-difficulty">
          <option value="всі">всі</option>
          <option value="легка">легка</option>
          <option value="середня">середня</option>
          <option value="складна">складна</option>
        </select>
        <button type="submit">Додати маршрут</button>
      </form>

      <canvas id="routes-chart" width="400" height="200"></canvas>
      
      <div id="routes-list" style="display:flex; flex-direction:column; gap:10px; margin-top:20px;"></div>
      <p id="total-km"></p>
    </section>
  `;
  //   renderRoutes(routesData);
  const form = document.querySelector("#add-route-form");
  const kmInput = document.querySelector("#route-km");
  const selectedRouteDifficulty = document.querySelector("#filter-difficulty");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let nameInput = document.querySelector("#route-name").value;
    let kmInputValue = Number(kmInput.value);
    let difficultyInput = selectedRouteDifficulty.value;

    let newRoute = {
      id: Date.now(),
      name: nameInput,
      distanceKm: kmInputValue,
      difficulty: difficultyInput,
    };
    // Data
    routesData.push(newRoute);
    saveToLocalStorage(routesData);

    await addItem(newRoute);
    routesData = await getAllItems();
    renderRoutes(routesData);
    form.reset();
  });

  kmInput.addEventListener("input", () => {
    if (Number(kmInput.value) > 300) {
      kmInput.setCustomValidity(
        "Довжина маршруту не може перевищувати 300 км.",
      );
    } else {
      kmInput.setCustomValidity("");
    }
  });

  renderRoutes(routesData);
}

function renderRouteDetailsPage(id) {
  const route = routesData.find((r) => r.id == id);
  if (!route) {
    renderNotFoundPage();
    return;
  }

  appContainer.innerHTML = `
    <section id="route-details-page">
      <h2>Деталі маршруту</h2>
      <p>ID: ${id}</p>
      <p>Назва: ${route.name}</p>
      <p>Довжина: ${route.distanceKm} км</p>
      <p>Складність: ${route.difficulty}</p>

      <canvas id="routes-chart" width="400" height="200"></canvas>
      
      <button type="button" onclick="window.history.back()">Назад до списку</button>
    </section>
  `;

  animateRoute(route);
}
function renderFilteredRoutesPage(difficulty) {
  const filteredRoutes = routesData.filter(
    (route) => route.difficulty === difficulty,
  );
  appContainer.innerHTML = `
    <section id="filtered-routes-page">
      <h2>Маршрути складності: ${difficulty}</h2>
      <button type="button" onclick="window.history.back()" style="margin-bottom: 20px;">← Назад до списку</button>
      
      <!-- Контейнер для карток -->
      <div id="routes-list" style="display:flex; flex-direction:column; gap:10px;"></div>
      <p id="total-km"></p>
    </section>
  `;
  if (filteredRoutes.length > 0) {
    renderRoutes(filteredRoutes);
  } else {
    document.querySelector("#routes-list").innerHTML =
      "<p>Маршрути не знайдені.</p>";
  }
}

function renderNotFoundPage() {
  appContainer.innerHTML = `
    <h2>Сторінка не знайдена</h2>
    <p>Вибачте, сторінка, яку ви шукаєте, не існує.</p>
  `;
}

function matchRoute(hash) {
  for (let route of routes) {
    //Check for exact match first
    if (route.path === hash) {
      return { view: route.view, param: null };
    }

    if (route.path.includes(":")) {
      const routeBase = route.path.split("/")[1]; //get the base part of the route ("route" or "difficulty")
      const hashParts = hash.split("/"); //divide the hash into parts

      if (hashParts[1] === routeBase && hashParts.length === 3) {
        // if the base matches and there is a parameter
        return { view: route.view, param: decodeURI(hashParts[2]) };
      }
    }
  }
  return null;
}

function router() {
  const hash = window.location.hash || "#/";

  const match = matchRoute(hash);

  if (match) {
    match.view(match.param);
  } else {
    renderNotFoundPage();
  }
}

window.addEventListener("hashchange", router);
