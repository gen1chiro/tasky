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

const addOrEditTask = () => {
    const task = document.createElement("div");
    const taskInfo = `<p class="${priorityInput.value}">${priorityInput.value}</p><h3>${titleInput.value}</h3><p>${descInput.value}</p>`;
    task.className = "task draggable";
    task.draggable = true;
    task.innerHTML = taskInfo;
    makeTaskDraggable(task);
    activeColumn.appendChild(task);
}

const clearForm = () => {
    titleInput.value = "";
    descInput.value = "";
}

const makeTaskDraggable = (task => {
    task.addEventListener("dragstart", () => {
        task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
    });
});

containers.forEach(container => {
    container.addEventListener("dragover", event => {
        event.preventDefault();
        const element = document.querySelector(".dragging");
        container.appendChild(element);
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
    addOrEditTask();
    clearForm();
    activeColumn = null;
    taskDialog.close();
})

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearForm();
    activeColumn = null;
   taskDialog.close();
});
