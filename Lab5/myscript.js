$(document).ready(() => {
    createPage(); // Function to create bare minimum of task input and button

    $(document).on('click', '.addButton', function() { // Event listner on add button
        let task = $('.inputBox').val(); // inputbox class's value to task
        if (task) { // if task exists
            addTask(task); // add the task to stage 2
            $('.inputBox').val(''); // clear the field of stage 1
        }
    });

    $(document).on('click', '.claimButton', function() { // Event listner on claim button
        let container = $(this).parent(); // container equating to the parent of the claim button element
        let task = container.children('.inputBox').text(); // because we are accessing this we want the children 
        // 'inputBox' and the text that is rendering as task
        container.remove(); // removing container from claim aka stage 2
        claimTask(task); // add that task to stage 3
    });

    $(document).on('click', '.abandonButton', function() { // Event listner on abandon button
        const container = $(this).parent(); // Now container equating to the parent of the abandon button element
        const task = container.children('.inputBox').text(); // Take whats the test aka task in the input and equate to the task
        container.remove(); // then remove the container
        revertToClaim(task); // and that task push back to claim
    });

    $(document).on('click', '.removeCompleteButton', function() { // Event listner on remove button
        $('.stage4 .completeContainer').remove(); // The whole container under id completeConatiner disappears
    });

    $(document).on('change', '.checkBox', function() { // Event listener type change
        let container = $(this).parent(); // Again container is what ever is the parent of the element u click
        let task = container.children('.inputBox').text(); // selecting text only aka the task 
        if ($(this).is(':checked')) { // if this checked
            container.remove(); // remove it
            completeTask(task); // push it to complete task
        } else { // not checked
            container.remove(); // still remove it
            revertToAbandon(task); // push it to abandon
        }
    });
    
    function revertToAbandon(task) { // using `` was learnt from stack overflow
        // container DOM creation
        const container = `<div class="abandonContainer"><input type="checkbox" class="checkBox" /><span class="inputBox">${task}</span><input type="button" value="Abandon" class="abandonButton button" /></div>`;
        // what ever the stage in this case stage 3 append to it the container
        $('.stage3').append(container);
    }
});

// Initial page creation from the tag body
function createPage() {
    $('body').append('<h1>To Do List</h1>'); // first h1
    $('h1').after('<div class="mainContainer"></div>'); // after another div with class mainContainer
    $('.mainContainer').append('<div class="stage1"></div>'); // now in mainContainer append div
    $('.stage1').append('<div class="addContainer"></div>');
    $('.addContainer').append('<input type="text" placeholder="new Task" class="inputBox" style="background-color: white" />')
    $('.addContainer').append('<input type="button" value="Add" class="button addButton" />');
    createStages('.mainContainer', ['stage2', 'stage3', 'stage4']); // calling function with array parameter and another parameter
}

function createStages(select, stageNames) { // A function to create all stages container to communicate between and render information accordingly
    stageNames.forEach(stage => { // for each stage do the following
        $(select).append(`<div class="${stage}"></div>`); // append the container with dynamic stage
    });
    $('.stage4').append('<input type="button" value="Remove Complete" class="button removeCompleteButton">'); // dont forget the remove button container
}

// function to add task and the container 
function addTask(task) {
    const container = `<div class="claimContainer"><span class="inputBox">${task}</span><input type="button" value="Claim" class="claimButton button"></div>`;
    $('.stage2').append(container);
}

// function to add claim task and the container
function claimTask(task) {
    const container = `<div class="abandonContainer"><input type="checkbox" class="checkBox" /><span class="inputBox">${task}</span><input type="button" value="Abandon" class="abandonButton button"></div>`;
    $('.stage3').append(container);
}

// function to revert back to claim and container
function revertToClaim(task) {
    const container = `<div class="claimContainer"><span class="inputBox">${task}</span><input type="button" value="Claim" class="claimButton button"></div>`;
    $('.stage2').append(container);
}

// fuction to complete task and container
function completeTask(task) {
    const container = `<div class="completeContainer"><input type="checkbox" class="checkBox" checked /><span class="inputBox"><s>${task}</s></span></div>`;
    $('.stage4').prepend(container);
}
