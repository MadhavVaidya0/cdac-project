const API_URL = window.API_URL || "http://192.168.10.129:30001";


// Load todos on page load
window.onload = function () {
  // If not logged in → go to login
  if (!localStorage.getItem("loggedIn") && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  // Only load todos on main page
  if (document.getElementById("taskList")) {
    loadTodos();
  }
};

// Redirect to login if not logged in
if (!localStorage.getItem("loggedIn") && !window.location.pathname.includes("login.html")) {
  window.location.href = "login.html";
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  // Simple demo login (replace with backend later)
  if (user === "admin" && pass === "admin") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";
  } else {
    document.getElementById("error").innerText = "Invalid credentials";
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

function loadTodos() {
  fetch(`${API_URL}/todos`)
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: taskText })
  })
    .then(res => res.json())
    .then(todo => {
      addTaskToUI(todo);
      input.value = "";
    });
}

function addTaskToUI(todo) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${todo.task}
    <button onclick="deleteTask(${todo.id}, this)">❌</button>
  `;
  document.getElementById("taskList").appendChild(li);
}

function deleteTask(id, btn) {
  fetch(`${API_URL}/todos/${id}`, { method: "DELETE" })
    .then(() => {
      btn.parentElement.remove();
    });
}

