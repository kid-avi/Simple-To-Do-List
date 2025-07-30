document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // Initialize todos array from local storage, or an empty array if none exist
    // JSON.parse converts the string back into a JavaScript object/array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    /**
     * Renders all to-do items to the DOM.
     * Clears the current list and re-creates elements for each todo.
     */
    function renderTodos() {
        todoList.innerHTML = ''; // Clear existing list items

        if (todos.length === 0) {
            // Display a message if no todos are present
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'text-center text-gray-500 py-4';
            emptyMessage.textContent = 'No tasks yet! Add one above.';
            todoList.appendChild(emptyMessage);
            // Hide clear all button if no todos
            clearAllBtn.classList.add('hidden');
            return;
        } else {
            clearAllBtn.classList.remove('hidden');
        }

        todos.forEach((todo, index) => {
            // Create the main list item element
            const listItem = document.createElement('li');
            // Apply dynamic classes based on completion status
            listItem.className = `
                flex items-center justify-between p-4 rounded-lg shadow-sm
                transition-all duration-200 ease-in-out transform
                ${todo.completed ? 'bg-green-100 text-gray-500 line-through' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}
            `;

            // Create a div for the text content, allowing it to grow
            const textContent = document.createElement('div');
            textContent.textContent = todo.text;
            textContent.className = 'flex-grow break-words pr-2'; // Added pr-2 for spacing from buttons

            // Create a div for action buttons (complete/delete)
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'flex items-center space-x-2 ml-auto'; // ml-auto pushes buttons to the right

            // Create the complete/uncomplete button
            const completeBtn = document.createElement('button');
            completeBtn.textContent = todo.completed ? 'Undo' : 'Done';
            completeBtn.className = `
                text-white font-medium py-1 px-3 rounded-md text-sm
                transition-all duration-200 ease-in-out transform hover:scale-105
                ${todo.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}
            `;
            completeBtn.addEventListener('click', () => toggleComplete(index));
            actionsDiv.appendChild(completeBtn);

            // Create the delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = `
                bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-md text-sm
                transition-all duration-200 ease-in-out transform hover:scale-105
            `;
            deleteBtn.addEventListener('click', () => deleteTodo(index));
            actionsDiv.appendChild(deleteBtn);

            // Append text content and actions to the list item
            listItem.appendChild(textContent);
            listItem.appendChild(actionsDiv);
            // Append the fully constructed list item to the main todo list
            todoList.appendChild(listItem);
        });

        saveTodos(); // Always save the current state of todos to local storage after rendering
    }

    /**
     * Adds a new to-do item to the list.
     * Gets text from input, creates a new todo object, adds it to the array, and re-renders.
     */
    function addTodo() {
        const todoText = todoInput.value.trim(); // Get input value and remove leading/trailing whitespace
        if (todoText !== '') { // Only add if the input is not empty
            todos.push({ text: todoText, completed: false }); // Add new todo object
            todoInput.value = ''; // Clear the input field
            renderTodos(); // Re-render the list to show the new item
        } else {
            // Optional: Provide user feedback for empty input
            todoInput.placeholder = "Please enter a task!";
            todoInput.classList.add('border-red-500', 'ring-red-500');
            setTimeout(() => {
                todoInput.placeholder = "What needs to be done?";
                todoInput.classList.remove('border-red-500', 'ring-red-500');
            }, 1500);
        }
    }

    /**
     * Deletes a to-do item from the list based on its index.
     * Uses splice to remove the item and then re-renders.
     * @param {number} index - The index of the todo item to delete.
     */
    function deleteTodo(index) {
        todos.splice(index, 1); // Remove 1 item at the specified index
        renderTodos(); // Re-render the list
    }

    /**
     * Toggles the 'completed' status of a to-do item.
     * @param {number} index - The index of the todo item to toggle.
     */
    function toggleComplete(index) {
        todos[index].completed = !todos[index].completed; // Toggle boolean status
        renderTodos(); // Re-render the list to reflect the change
    }

    /**
     * Clears all completed to-do items from the list.
     * Filters the todos array to keep only uncompleted items and then re-renders.
     */
    function clearAllCompleted() {
        // Filter out todos where 'completed' is true
        todos = todos.filter(todo => !todo.completed);
        renderTodos(); // Re-render the list
    }

    /**
     * Saves the current 'todos' array to local storage.
     * Converts the array to a JSON string before saving.
     */
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Event Listeners
    addTodoBtn.addEventListener('click', addTodo); // Add todo on button click

    // Add todo on Enter key press in the input field
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Clear all completed todos on button click
    clearAllBtn.addEventListener('click', clearAllCompleted);

    // Initial render when the page loads to display any saved todos
    renderTodos();
});
