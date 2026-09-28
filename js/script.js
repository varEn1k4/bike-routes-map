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

console.log(routesData);

// Function to estimate time in minutes based on distance
const estimateMinutes = (km) => Math.round((km / 15) * 60);

let totalLength = 0;

// Use "of" to iterate over the array elements. In this case, 3 times
for (let route of routesData) {
  totalLength += route.km;

  // Estimate time in minutes for the current route
  let timeInMinutes = estimateMinutes(route.km);
  let categoryMessage = "";

  // Determine the category message based on difficulty
  if (route.difficulty === "легка") {
    categoryMessage = "Цей маршрут підходить для початківців";
  } else if (route.difficulty === "середня") {
    categoryMessage = "Цей маршрут підходить для досвідчених велосипедистів";
  } else if (route.difficulty === "складна") {
    categoryMessage = "Цей маршрут підходить для професійних велосипедистів";
  }

  console.log(
    `Маршрут: ${route.name}, Довжина: ${route.km} км, Складність: ${route.difficulty}, Час: ${timeInMinutes} хв. ${categoryMessage}`,
  );
}

console.log(totalLength);
