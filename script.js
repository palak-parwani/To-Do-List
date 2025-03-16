// Get references to the input box and list container
const inputBox = document.getElementById("input-box");
const timerInput = document.getElementById("timer-input");
const listContainer = document.getElementById("list-container");

// Function to add a task
function addTask() {
    const taskValue = inputBox.value.trim();
    const timerValue = timerInput.value.trim();

    if (taskValue === "") {
        alert("You must write something!");
        return;
    }

    // Create list item
    let li = document.createElement("li");

    // Create a span for task text
    let taskSpan = document.createElement("span");
    taskSpan.className = "task-text";
    taskSpan.innerHTML = taskValue;
    li.appendChild(taskSpan);

    // Create a timer display (optional)
    if (timerValue !== "" && !isNaN(timerValue) && timerValue > 0) {
        let timerSpan = document.createElement("span");
        timerSpan.className = "timer";
        let countdownTime = parseInt(timerValue) * 60;
        timerSpan.innerHTML = formatTime(countdownTime);
        li.appendChild(timerSpan);
        startCountdown(timerSpan, countdownTime, taskValue);
    }

    // Create a delete button
    let deleteSpan = document.createElement("span");
    deleteSpan.innerHTML = "\u00D7"; // Cross icon
    deleteSpan.className = "delete";
    deleteSpan.onclick = function () {
        li.remove();
        saveData();
    };
    li.appendChild(deleteSpan);

    // Append to list container
    document.getElementById("list-container").appendChild(li);

    // Clear input fields
    inputBox.value = "";
    timerInput.value = "";

    // Save data
    saveData();
}

// Function to start a countdown timer
function startCountdown(timerElement, timeLeft, task) {
    let countdown = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerElement.innerHTML = "Time's up!";
            notifyUser(task);
        }
    }, 1000);
}

// Function to format time in mm:ss
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Function to show a notification
function notifyUser(task) {
    if (Notification.permission === "granted") {
        new Notification("To-Do Reminder", {
            body: `Your task "${task}" is due!`,
            icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png"
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                notifyUser(task);
            }
        });
    } else {
        alert(`Your task "${task}" is due!`);
    }
}

// Add event listener for Enter key
inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission behavior
        addTask();
    }
});

// Also add event listener for Enter key on timer input
timerInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission behavior
        addTask();
    }
});

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked"); // Toggle checked class
        e.target.classList.toggle("completed"); // Add completed class
        saveData();
    } else if (e.target.classList.contains("delete")) {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

// Save and load data from localStorage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
}

// Load tasks when the page loads
showTask();
