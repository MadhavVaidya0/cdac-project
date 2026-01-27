const API_URL = window.API_URL || "http://192.168.10.129:30001";

// ---------------- PAGE LOAD ----------------
window.onload = function () {
  // If token missing → go to login
  if (!localStorage.getItem("token") && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  // Only load todos on main page
  if (document.getElementById("taskList")) {
    loadTodos();
  }
};

// ---------------- AUTH FUNCTIONS ----------------

function register() {
  console.log("Register button clicked");

  fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  })
    .then(res => res.json())
    .then(data => alert(data.message || data.error));
}


function login() {
  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      } else {
        document.getElementById("error").innerText = "Invalid credentials";
      }
    });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ---------------- TODO FUNCTIONS ----------------

function loadTodos() {
  fetch(`${API_URL}/todos`, {
    headers: {
      "Authorization": localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";
      data.forEach(todo => addTaskToUI(todo));
    });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (taskText === "") return;

  fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({ task: taskText })
  })
    .then(res => res.json())
    .then(todo => {
      addTaskToUI(todo);
      input.value = "";
    });
}

function deleteTask(id, btn) {
  fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": localStorage.getItem("token")
    }
  }).then(() => {
    btn.parentElement.remove();
  });
}

// ---------------- UI HELPER ----------------

function addTaskToUI(todo) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${todo.task}
    <button onclick="deleteTask(${todo.id}, this)">❌</button>
  `;
  document.getElementById("taskList").appendChild(li);
}

