// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

// Load tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks to the DOM
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.className = 'task-text';

        // Mark task as completed
        taskText.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // Remove task button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-task';
        removeButton.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        taskItem.appendChild(taskText);
        taskItem.appendChild(removeButton);
        taskList.appendChild(taskItem);
    });
}

// Save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add task handler
addTaskButton.addEventListener('click', () => {
    try {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            throw new Error('Task cannot be empty');
        }
        
        tasks.push({ text: taskText, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
    } catch (error) {
        alert(error.message);
    }
});

// Initialize Sortable.js for drag-and-drop functionality
new Sortable(taskList, {
    animation: 150,
    onEnd: (event) => {
        const [movedTask] = tasks.splice(event.oldIndex, 1);
        tasks.splice(event.newIndex, 0, movedTask);
        saveTasks();
        renderTasks();
    },
});

// Initial render
renderTasks();
