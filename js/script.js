//CONSTANTS FOR TASK 7
const staticCards = document.querySelectorAll(".routes");
const listContainer = document.querySelector("#routes-list");
const totalKmElement = document.querySelector("#total-km");
//CONSTANTS FOR TASK 8
const form = document.querySelector("#add-route-form");
const kmInput = document.querySelector("#route-km");
const selectedRouteDifficulty = document.querySelector("#filter-difficulty");
//Constants for TASK 10
const DB_NAME = "RoutesDatabase";
const STORE_NAME = "routes";
const DB_VERSION = 1;

let routesData = [
  {
    id: 1,
    name: "Веломаршрут 1",
    km: 32,
    difficulty: "легка",
  },
  {
    id: 2,
    name: "Веломаршрут 2",
    km: 57,
    difficulty: "середня",
  },
  {
    id: 3,
    name: "Веломаршрут 3",
    km: 86,
    difficulty: "складна",
  },
];

//TASK 10 FUNCTIONS
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
    renderRoutes(routesData);
  } catch (error) {
    console.error("Помилка ініціалізації додатку:", error);
    alert("Помилка ініціалізації додатку. База даних недоступна.");
  }
}

initApp();

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
//END OF TASK 7

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  let nameInput = document.querySelector("#route-name").value;
  let kmInput = Number(document.querySelector("#route-km").value);
  let difficultyInput = document.querySelector("#filter-difficulty").value;

  let newRoute = {
    id: Date.now(),
    name: nameInput,
    km: kmInput,
    difficulty: difficultyInput,
  };

  await addItem(newRoute);

  routesData = await getAllItems();
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
