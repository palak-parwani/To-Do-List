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

    // Create a new list item
    let li = document.createElement("li");
    li.innerHTML = `${taskValue}`;

    // Create a timer display
    if (timerValue !== "" && !isNaN(timerValue) && timerValue > 0) {
        let timerSpan = document.createElement("span");
        timerSpan.className = "timer";
        let countdownTime = parseInt(timerValue) * 60; // Convert minutes to seconds
        timerSpan.innerHTML = formatTime(countdownTime);
        li.appendChild(timerSpan);

        // Start the countdown
        startCountdown(timerSpan, countdownTime, taskValue);
    }

    listContainer.appendChild(li);

    // Create a delete button
    let span = document.createElement("span");
    span.innerHTML = "\u00D7";
    span.className = "delete";
    li.appendChild(span);

    inputBox.value = "";
    timerInput.value = "";
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

// Event listener for deleting tasks
listContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete")) {
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
