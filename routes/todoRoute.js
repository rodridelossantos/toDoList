const express = require("express");
const todoRouter = express.Router();
// Importamos los controllers necesarios
const todoController = require("../controllers/todoController");

todoRouter.get("/", todoController.getTasks);

todoRouter.get("/:id", todoController.getTaskById);

todoRouter.post("/", todoController.createTask);

todoRouter.put("/:id", todoController.updateTask);

todoRouter.delete("/:id", todoController.deleteTask);

module.exports = todoRouter;
