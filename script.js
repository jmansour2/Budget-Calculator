     // Declare a global variable to hold the pie chart instance
        let categoryPieChartInstance = null; // New pie chart for individual categories
        let pieChartInstance = null;

    document.addEventListener('DOMContentLoaded', () => {
    const incomeItems = document.getElementById('income-items');
    const expenseItems = document.getElementById('expense-items');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const remainingBudgetEl = document.getElementById('remaining-budget');
    const budgetWarning = document.getElementById('budget-warning');

    const pieChartCanvas = document.getElementById('pie-chart');
    const categoryPieChartCanvas = document.getElementById('category-pie-chart');
    
    const updateCategoryDropdown = (dropdown) => {
                const selectedCategories = [];
                expenseItems.querySelectorAll('.expense-category-dropdown').forEach(d => {
                    const selectedValue = d.value;
                    if (selectedValue && selectedValue !== 'Other') {
                        selectedCategories.push(selectedValue);
                    }
                });
                const options = dropdown.querySelectorAll('option');
                options.forEach(option => {
                    if (option.value !== 'Other' && selectedCategories.includes(option.value)) {
                        option.disabled = true;
                    } else {
                        option.disabled = false;
                    }
                });
            };

            // Handle category selection change
            expenseItems.addEventListener('change', (event) => {
                if (event.target.classList.contains('expense-category-dropdown')) {
                    updateCategoryDropdown(event.target);
                }
            });

            // Handle category selection
            const handleCategorySelection = (selectElement) => {
                const selectedCategory = selectElement.value;
                if (selectedCategory && selectedCategory !== 'Other') {
                    Array.from(selectElement.options).forEach(option => {
                        if (option.value === selectedCategory) {
                            option.disabled = true; // Disable the selected option
                        }
                    });
                }
                selectElement.querySelector('option[value="Other"]').disabled = false;
            };

    // Function to handle double-click (allow typing a custom category)
    const makeCategoryEditable = (selectElement) => {
        // Replace dropdown with text input when double-clicked
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'form-control custom-category-input';
        inputField.placeholder = 'Enter custom expense category';
        inputField.value = selectElement.value;

        // Replace dropdown with input field
        selectElement.replaceWith(inputField);

        // Event listener to update the custom category when typing is finished
        inputField.addEventListener('blur', () => {
            // Replace the input field back with the dropdown and add custom value
            const newSelectElement = document.createElement('select');
            newSelectElement.className = 'form-control expense-category-dropdown';
            newSelectElement.innerHTML = `
                <option value="">Select or Type Expense Category</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Groceries">Groceries</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
            `;

            // Set the custom category entered by the user
            const customCategoryOption = document.createElement('option');
            customCategoryOption.value = inputField.value;
            customCategoryOption.textContent = inputField.value;
            newSelectElement.appendChild(customCategoryOption);

            // Re-enable all categories for future use
            Array.from(newSelectElement.options).forEach(option => option.disabled = false);

            // Append the updated dropdown back to the DOM
            expenseItems.querySelector('.col-6').appendChild(newSelectElement);

            // Update category and remove the option from the list
            handleCategorySelection(newSelectElement);
        });
    };
    
    // Event listener for category selection to remove selected categories
    expenseItems.addEventListener('change', (event) => {
        if (event.target.classList.contains('expense-category-dropdown')) {
            handleCategorySelection(event.target);
        }
    });
    // Functions to calculate totals
    const calculateTotal = (selector) => {
        return Array.from(selector.querySelectorAll('input[type="number"]'))
            .reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
    };
    const updateBudget = () => {
        const totalIncome = calculateTotal(incomeItems);
        const totalExpenses = calculateTotal(expenseItems);
        const remainingBudget = totalIncome - totalExpenses;

    // Log to check if totals are correct
        console.log("Total Income: " + totalIncome);
        console.log("Total Expenses: " + totalExpenses);
        console.log("Remaining Budget: " + remainingBudget);

    // Only update if the values are valid numbers
        if (isNaN(totalIncome) || isNaN(totalExpenses)) {
            console.log("Invalid data: Ensure all fields are filled with numbers.");
        return;
    }

    totalIncomeEl.textContent = totalIncome.toFixed(2);
    totalExpensesEl.textContent = totalExpenses.toFixed(2);
    remainingBudgetEl.textContent = remainingBudget.toFixed(2);

    // Handle warning for budget exceeding
    budgetWarning.classList.toggle('d-none', remainingBudget >= 0);

    // Update the charts
    updateCharts(totalIncome, totalExpenses);
};
const updateCharts = (totalIncome, totalExpenses) => {
    const visualizationContainer = document.getElementById('visualizations');

    // Clear existing charts or messages
    visualizationContainer.innerHTML = '';

    if (totalExpenses > totalIncome) {
        // Display an error message when expenses exceed income
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger text-center';
        errorMessage.textContent = 'Error: Expenses exceed income. Adjust your budget to proceed.';
        visualizationContainer.appendChild(errorMessage);
        return;
    }

    // Create chart canvases if budget is valid
    const pieChartCanvas = document.createElement('canvas');
    pieChartCanvas.id = 'pie-chart';
    pieChartCanvas.className = 'pie-chart';
    visualizationContainer.appendChild(pieChartCanvas);

    const categoryPieChartCanvas = document.createElement('canvas');
    categoryPieChartCanvas.id = 'category-pie-chart';
    categoryPieChartCanvas.className = 'pie-chart';
    visualizationContainer.appendChild(categoryPieChartCanvas);

    // Render Pie Chart (Expenses vs Remaining Budget)
    if (pieChartInstance) pieChartInstance.destroy();
    pieChartInstance = new Chart(pieChartCanvas, {
        type: 'pie',
        data: {
            labels: ['Expenses', 'Remaining'],
            datasets: [{
                data: [totalExpenses, totalIncome - totalExpenses],
                backgroundColor: ['#ff6384', '#36a2eb'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${percentage}%`;
                    },
                    color: 'white',
                    font: { weight: 'bold', size: 14 }
                }
            }
        }
    });

    // Render Expense Category Breakdown Pie Chart
    if (categoryPieChartInstance) categoryPieChartInstance.destroy();

    const categories = [];
    const amounts = [];
    expenseItems.querySelectorAll('div.row').forEach(row => {
        const category = row.querySelector('select').value || 'Other';
        const amount = parseFloat(row.querySelector('input[type="number"]').value) || 0;
        if (category && amount > 0) {
            categories.push(category);
            amounts.push(amount);
        }
    });

    if (categories.length > 0 && amounts.length > 0) {
        categoryPieChartInstance = new Chart(categoryPieChartCanvas, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: ['#FF5733', '#FFC300', '#DAF7A6', '#33FF57', '#33FFF6', '#338AFF', '#AF33FF', '#FF33A8'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    datalabels: {
                        formatter: (value, context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${percentage}%`;
                        },
                        color: 'white',
                        font: { weight: 'bold', size: 14 }
                    }
                }
            }
        });
    }
};


    // Add event listeners for input change to trigger the budget update
    incomeItems.addEventListener('input', updateBudget);
    expenseItems.addEventListener('input', updateBudget);

//DO NOT TOUCH 
// WORKING 
// REMOVE TABS AND Orginzes budget
//features i want to add are drop down menu for income and expenses

document.getElementById('add-income').addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'row mb-2';
        row.innerHTML = '<div class="col-6"><input type="text" class="form-control" placeholder="Income Source"></div>' +
                        '<div class="col-4"><input type="number" class="form-control" placeholder="Amount"></div>' +
                        '<div class="col-2"><button class="btn btn-danger remove-button">Remove</button></div>';
        incomeItems.appendChild(row);
        row.querySelector('.remove-button').addEventListener('click', () => {
            row.remove();
            updateBudget();
        });
    });

    // Add new expense row
    document.getElementById('add-expense').addEventListener('click', () => {
                const row = document.createElement('div');
                row.className = 'row mb-2';
                row.innerHTML = `
                    <div class="col-6">
                        <select class="form-control expense-category-dropdown">
                            <option value="">Select or Type Expense Category</option>
                            <option value="Rent">Rent</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Groceries">Groceries</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="col-4">
                        <input type="number" class="form-control expense-input" placeholder="Amount">
                    </div>
                    <div class="col-2">
                        <button class="btn btn-danger remove-button">Remove</button>
                    </div>
                `;
                expenseItems.appendChild(row);

const removeButton = row.querySelector('.remove-button');
removeButton.addEventListener('click', () => {
    row.remove();
    updateBudget();
});

const amountInput = row.querySelector('input[type="number"]');
amountInput.addEventListener('input', () => {
    preventNegativeInput(amountInput);
    updateBudget();
});

amountInput.addEventListener('input', () => {
    removeButton.style.display = amountInput.value > 0 ? 'block' : 'none';
});

// Update category dropdowns
updateCategoryDropdown(row.querySelector('.expense-category-dropdown'));
});


// Update category dropdown options on page load
updateCategoryDropdown(document.querySelector('.expense-category-dropdown'));
});
    
    
    console.log('Budget Calculator structure complete. Ready for detailed refinement.')
