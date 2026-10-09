const http = require("http");
const routesData = require("./routes.json");
const headers = {
  // Set CORS headers
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const server = http.createServer((req, res) => {
  if (req.url === "/api/routes" && req.method === "GET") {
    res.writeHead(200, headers);
    res.end(JSON.stringify(routesData));
    // Handle GET request for a specific route by ID
  } else if (req.url.startsWith("/api/routes/") && req.method === "GET") {
    const routeId = req.url.split("/")[3]; // Extract the route ID from the URL
    const route = routesData.find((r) => r.id === parseInt(routeId));

    if (route) {
      res.writeHead(200, headers);
      res.end(JSON.stringify(route));
    } else {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  } else {
    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
