const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "CLAVE ULTRA SECRETA";

const todoRouter = require("./routes/todoRoute.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./public/index.html");
});

// Auth
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ username }, SECRET_KEY);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Usuario y/o contraseña incorrecto" });
  }
});

// Middleware que autoriza a realizar peticiones a /people
app.use("/tasks", (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
    console.log(decoded);
    next();
  } catch (err) {
    res.status(401).json({ message: "Usuario no autorizado" });
  }
});
//---

// Asociamos el router de people con la ruta /people
app.use("/tasks", todoRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
