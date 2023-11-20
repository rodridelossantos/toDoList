document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    getTasks(token);
  } else {
    displayLogin();
  }
});

// Se fija si hay un token, si no hay pide login

async function getTasks(token) {
  try {
    const response = await fetch("/tasks", {
      headers: {
        "Content-Type": "application/json",
        "access-token": token,
      },
    });

    if (!response.ok) {
      alert(response.status);
      displayLogin();
      return false;
    }

    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    alert("Error obteniendo tareas");
  }
}

function displayTasks(tasks) {
  const tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = "";

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.classList.add("d-flex");
    listItem.classList.add("flex-nowrap");
    listItem.classList.add("gap-1");

    listItem.innerHTML = `
      <span class="d-inline-block w-75 h5 d-flex align-items-center">${
        task.name
      } - (${task.status === 1 ? "Pendiente" : "Completada"})</span>
      <button class="btn btn-info" onclick="editTask(${
        task.id
      })">Editar</button>
      <button class="btn btn-danger" onclick="removeTask(${
        task.id
      })">Eliminar</button>
      <button class="btn btn-success" onclick="toggleTaskStatus(${task.id}, ${
      task.status
    })">Marcar ${task.status === 1 ? "Completada" : "Pendiente"}</button>
    `;
    tasksList.appendChild(listItem);
  });

  // con task.status podemos ver si la tarea está completada o pendiente.
  // Si su valor es 1 entonces está compeltada, si es 0 está pendiente.
  //   Apretando en el botón de marcar corremos una función que cambia el status de la tarea a 1 o a 0.

  const addTaskButton = document.createElement("button");
  addTaskButton.classList.add("btn");
  addTaskButton.classList.add("btn-primary");
  addTaskButton.textContent = "Nueva tarea";
  addTaskButton.onclick = addNewTask;
  tasksList.appendChild(addTaskButton);
}

function displayLogin() {
  const loginForm = document.createElement("div");
  loginForm.id = "loginForm";
  loginForm.innerHTML = `
      <h2>Login</h2>
        <p>Importante: el usuario y contraseña definitivamente no son "admin"</p>     
      <form>
  <div class="mb-3">
    <label for="username" class="form-label" required/>Username:</label>
    <input type="text" class="form-control" id="username">
  </div>
  <div class="mb-3">
    <label for="password" class="form-label" required>Password:</label>
    <input type="password" class="form-control" id="password">
  </div>
  <button type="button" class="btn btn-primary" onclick="login()">Login</button>
</form>


    `;

  document.body.appendChild(loginForm);
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      alert("Usuario y/o contraseña incorrectos");
      return false;
    }

    const data = await response.json();
    const token = data.token;

    localStorage.setItem("token", token);
    document.body.removeChild(document.getElementById("loginForm"));

    getTasks(token);
  } catch (error) {
    alert("Error logeando");
  }
}

async function editTask(taskId) {
  const newName = prompt("Ingresá un nuevo nombre para la tarea:");

  if (newName) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        alert("No se pudo hacer la petición");
        displayLogin();
        return false;
      }

      //   Si todo sale bien, se intenta mostrar las tareas actualizadas
      getTasks(token);
    } catch (error) {
      alert("Error editando tarea");
    }
  }
}

async function removeTask(taskId) {
  const wantToDelete = confirm(
    "Estás seguro de que querés eliminar esta tarea?"
  );

  if (wantToDelete) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      });

      if (!response.ok) {
        alert("No se pudo hacer la petición");
        displayLogin();
        return false;
      }

      getTasks(token);
    } catch (error) {
      alert("Error elminando tarea");
    }
  }
}

async function addNewTask() {
  const newName = prompt("Ingresá una nueva tarea:");

  if (newName) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
        body: JSON.stringify({
          name: newName,
          status: 1,
        }),
      });

      if (!response.ok) {
        alert("No se pudo hacer la petición");
        displayLogin();
        return false;
      }
      // Fetchear y mostrar tareas actualizadas
      getTasks(token);
    } catch (error) {
      alert("Error agregando nueva tarea:");
    }
  }
}

async function toggleTaskStatus(taskId, currentStatus) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": token,
      },
      body: JSON.stringify({ status: currentStatus === 1 ? 0 : 1 }),
    });

    if (!response.ok) {
      alert("No se pudo hacer la petición");
      displayLogin();
      return false;
    }

    getTasks(token);
  } catch (error) {
    alert("Error cambiando el estado de la tarea");
  }
}
