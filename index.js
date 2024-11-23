const containers = document.querySelectorAll(".column");
const tests = document.querySelectorAll(".task");

containers.forEach(container => {
    container.addEventListener("dragover", event => {
        event.preventDefault();
        const element = document.querySelector(".dragging");
        container.appendChild(element);
    })
})

tests.forEach(test => {
    test.addEventListener("dragstart", () => {
        test.classList.add("dragging");
    });

    test.addEventListener("dragend", () => {
        test.classList.remove("dragging");
    });
});
