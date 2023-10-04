let addButton = document.getElementById('addButton');
let input = document.getElementById('input');
let render = document.getElementById('render');
let sortButton = document.getElementById('sortButton');

addButton.addEventListener('click', function() {
    if (input.value == '')
    {
        console.log("This is empty");
    }
    else
    {
        let div = document.createElement('div');
        div.textContent = input.value;
        render.insertBefore(div, render.firstChild);
        div.classList.add('renderTask');
    }
    input.value = '';
});

sortButton.addEventListener('click', function() {
    let tasks = Array.from(render.children);
    tasks = tasks.filter((task) => task.classList.contains('renderTask'));
    tasks.sort((a, b) => {
        return a.textContent.localeCompare(b.textContent);
    });
    let taskInputContainer = document.getElementById('insertBefore');
    tasks.forEach(task => {
        render.insertBefore(task, taskInputContainer);
    });
});
