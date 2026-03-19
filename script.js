const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filters button");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* Save */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Render */
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (currentFilter === "completed") return t.completed;
    if (currentFilter === "pending") return !t.completed;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement("li");

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) span.classList.add("completed");

    checkbox.addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    left.appendChild(checkbox);
    left.appendChild(span);

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "✕";

    delBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.appendChild(left);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  updateCount();
}

/* Count */
function updateCount() {
  const remaining = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${remaining} tasks left`;
}

/* Add */
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
}

/* Events */
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* Init */
renderTasks();