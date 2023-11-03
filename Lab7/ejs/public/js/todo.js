// appending hidden for submission
function submitFormWithCheckboxState(checkboxElement)
{
    const form = checkboxElement.form;
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'checkboxChecked';
    hiddenInput.value = checkboxElement.checked;
    form.appendChild(hiddenInput);
    form.submit();
}

// Adding event listner for all checkbox
document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.checkBox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // accessing only one that is clicked
            submitFormWithCheckboxState(this);
        });
    });
});