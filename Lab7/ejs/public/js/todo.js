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

document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.checkBox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            submitFormWithCheckboxState(this);
        });
    });
});