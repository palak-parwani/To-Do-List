// Get references to the input box and list container
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Function to add a task when the "Add" button is clicked or Enter is pressed
function addTask() {
    const taskValue = inputBox.value.trim(); // Trim whitespace from the input value
    if (taskValue === "") {
        alert("You must write something!"); // Show an alert if the input is empty
        return; // Stop the function if no valid input is provided
    }

    // Create a new list item (li) element
    let li = document.createElement("li");
    li.innerHTML = taskValue; // Set the text of the list item to the input value
    listContainer.appendChild(li); // Add the list item to the list container

    // Create a span element to act as the delete (cross) button
    let span = document.createElement("span");
    span.innerHTML = "\u00D7"; // Unicode character for the cross icon
    li.appendChild(span); // Append the delete button to the list item

    inputBox.value = ""; // Clear the input field after adding the task
    saveData(); // Save the updated task list to localStorage
}

// Event listener for listContainer to handle clicks on list items or delete buttons
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked"); // Toggle the "checked" class for the clicked list item
        saveData(); // Save the updated state to localStorage
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove(); // Remove the list item if the delete button is clicked
        saveData(); // Save the updated task list to localStorage
    }
}, false);

// Event listener for the input box to detect the Enter key
inputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { // Check if the pressed key is Enter
        addTask(); // Call the addTask function
    }
});

// Function to save the current list state to localStorage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML); // Save the innerHTML of the list container
}

// Function to load tasks from localStorage and display them when the page loads
function showTask() {
    const savedData = localStorage.getItem("data"); // Retrieve the saved task list from localStorage
    if (savedData) {
        listContainer.innerHTML = savedData; // Set the list container's content to the saved tasks

        // Remove any empty or invalid tasks (e.g., undefined items)
        const items = listContainer.querySelectorAll("li");
        items.forEach(item => {
            if (!item.textContent.trim() || item.textContent === "undefined") {
                item.remove(); // Remove invalid list items
            }
        });

        attachEventListenersToSpans(); // Reattach event listeners to delete buttons after restoring the list
    }
}

// Function to reattach click event listeners to the delete buttons (spans)
function attachEventListenersToSpans() {
    const spans = listContainer.querySelectorAll("span"); // Select all delete buttons
    spans.forEach(span => {
        span.addEventListener("click", function () {
            this.parentElement.remove(); // Remove the corresponding task
            saveData(); // Save the updated task list to localStorage
        });
    });
}

// Load tasks from localStorage when the page loads
showTask();
