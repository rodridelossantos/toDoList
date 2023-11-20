const listModel = require("../models/todoModel");

const getTasks = async (req, res) => {
  const tasks = await listModel.getTasks();
  res.json(tasks);
};

const getTaskById = async (req, res) => {
  const id = parseInt(req.params.id);
  const task = await listModel.getTaskById(id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: "Tarea no encontrada" });
  }
};

const createTask = async (req, res) => {
  const createdTask = await listModel.createTask(req.body);
  if (createdTask) {
    res.json(createTask);
  } else {
    res.status(500).json({ message: "Se rompió el servidor" });
  }
};

const updateTask = async (req, res) => {
  const id = parseInt(req.params.id);
  const task = await listModel.getTaskById(id);

  if (task) {
    const updatedTask = await listModel.updateTask(parseInt(req.params.id), {
      ...task,
      ...req.body,
    });

    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(500).json({ message: "Se rompió el servidor" });
    }
  } else {
    res.status(404).json({ message: "Tarea no encontradad" });
  }
};

const deleteTask = async (req, res) => {
  const id = parseInt(req.params.id);
  const task = await listModel.getTaskById(id);
  if (task) {
    const result = await listModel.deleteTask(parseInt(req.params.id));

    if (result) {
      res.json(task);
    } else {
      res.status(500).json({ message: "Se rompió el servidor" });
    }
  } else {
    res.status(404).json({ message: "Tarea no encontrada" });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
