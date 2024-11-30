const containers = document.querySelectorAll(".column");
const tasks = document.querySelectorAll(".task");
const addTaskBtns = document.querySelectorAll(".add-button");
const taskDialog = document.querySelector(".task-dialog");
const confirmBtn = document.querySelector(".confirm");
const cancelBtn = document.querySelector(".cancel");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-description");
const priorityInput = document.getElementById("priority");

let activeColumn = null;
let activeTask = null;
let isEditing = false;

const addTask = () => {
    const task = document.createElement("div");
    const taskInfo = `<div class="upper-container"><p class="task-priority ${priorityInput.value}">${priorityInput.value}</p>
                             <i class="fa-solid fa-ellipsis-vertical"></i></div>
                             <div class="middle-container"><h3 class="task-title">${titleInput.value}</h3>
                             <div class="icon-container hidden">
                             <i class="fa-solid fa-pen"></i>
                             <i class="fa-solid fa-trash"></i>
                             </div></div>
                             <p class="task-desc">${descInput.value}</p>`;
    task.className = "task draggable";
    task.draggable = true;
    task.innerHTML = taskInfo;
    activeColumn.appendChild(task);
    updateTaskCount(activeColumn);
}

const editTask = (task) => {
    const taskPriority = task.querySelector(".task-priority");
    const taskPriorityClasses = taskPriority.classList;
    taskPriority.textContent = priorityInput.value;
    taskPriority.classList.replace(taskPriorityClasses[1], priorityInput.value);
    task.querySelector(".task-title").textContent = titleInput.value;
    task.querySelector(".task-desc").textContent = descInput.value;
}

const updateTaskCount = (container) => {
    const tasks = container.querySelectorAll(".task");
    container.querySelector(".task-count").textContent = tasks.length;
}

const extractTaskData = (task) => {
    priorityInput.value = task.querySelector(".task-priority").textContent;
    titleInput.value = task.querySelector(".task-title").textContent;
    descInput.value = task.querySelector(".task-desc").textContent;
}

const clearForm = () => {
    titleInput.value = "";
    descInput.value = "";
    priorityInput.value = "Low";
}

const saveToLocalStorage = () => {
    const kanbanData = {
        todo: getTasksFromColumn("todo"),
        inProgress: getTasksFromColumn("in-progress"),
        done: getTasksFromColumn("done")
    };

    localStorage.setItem("kanbanBoard", JSON.stringify(kanbanData));
}

const loadFromLocalStorage = () => {
    const data = localStorage.getItem("kanbanBoard");

    if (data) {
        const {todo, inProgress, done} = JSON.parse(data);
        renderTask("todo", todo);
        renderTask("in-progress", inProgress);
        renderTask("done", done);
    }
}

const renderTask = (columnId, tasks) => {
    const column = document.getElementById(columnId);

    tasks.forEach(task => {
        const element = document.createElement("div");
        const taskInfo = `<div class="upper-container"><p class="task-priority ${task.taskPriority}">${task.taskPriority}</p>
                             <i class="fa-solid fa-ellipsis-vertical"></i></div>
                             <div class="middle-container"><h3 class="task-title">${task.taskName}</h3>
                             <div class="icon-container hidden">
                             <i class="fa-solid fa-pen"></i>
                             <i class="fa-solid fa-trash"></i>
                             </div></div>
                             <p class="task-desc">${task.taskDesc}</p>`;
        element.className = "task draggable";
        element.draggable = true;
        element.innerHTML = taskInfo;
        column.appendChild(element);
        updateTaskCount(column);
    });
}

const getTasksFromColumn = (columnId) => {
    const column = document.getElementById(columnId);
    const tasks = column.querySelectorAll(".task");
    const tasksArray = Array.from(tasks);

    return tasksArray.map(task => ({
        taskName: task.querySelector(".task-title").textContent,
        taskDesc: task.querySelector(".task-desc").textContent,
        taskPriority: task.querySelector(".task-priority").textContent
    }));
}

const getClosestTask = (container, mouseY) => {
    const tasks = [...container.querySelectorAll('.task:not(.dragging)')];
    return tasks.reduce((closest, task) => {
        const box = task.getBoundingClientRect();
        const offset = mouseY - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: task };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

const init = () => {
    loadFromLocalStorage();
}

containers.forEach(container => {
    updateTaskCount(container);
    container.addEventListener("dragover", e => {
        e.preventDefault();
        const element = document.querySelector(".dragging");
        if (element) {
            const closestTask = getClosestTask(container, e.clientY);
            if (closestTask) {
                container.insertBefore(element, closestTask);
            } else {
                container.appendChild(element);
            }
        }
    });
});

addTaskBtns.forEach(btn => {
   btn.addEventListener("click", () => {
       activeColumn = btn.closest('.column');
       taskDialog.showModal();
   })
});

confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isEditing? editTask(activeTask) : addTask();
    clearForm();
    activeColumn = null;
    activeTask = null;
    isEditing = false;
    taskDialog.close();
    saveToLocalStorage();
})

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearForm();
    activeColumn = null;
   taskDialog.close();
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-ellipsis-vertical')) {
        const iconContainer = e.target.parentElement.nextElementSibling.querySelector(".icon-container");
        iconContainer.classList.toggle("hidden");
    }

    if (e.target.classList.contains("fa-pen")) {
        const currentTask = e.target.closest(".task");
        extractTaskData(currentTask);
        isEditing = true;
        activeTask = e.target.closest(".task");
        taskDialog.showModal();
    }

    if (e.target.classList.contains("fa-trash")) {
        const column = e.target.closest(".column");
        e.target.closest(".task").remove();
        updateTaskCount(column);
        saveToLocalStorage();
    }
});

document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("draggable")) {
        e.target.classList.add("dragging");
    }
});

document.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("draggable")) {
        e.target.classList.remove("dragging");
        containers.forEach(container => {
            updateTaskCount(container);
        });
        saveToLocalStorage();
    }
});

init();



