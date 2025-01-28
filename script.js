// Declare variables for the chart instances
let pieChartInstance = null;
let categoryPieChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    const incomeItems = document.getElementById('income-items');
    const expenseItems = document.getElementById('expense-items');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const remainingBudgetEl = document.getElementById('remaining-budget');
    const budgetWarning = document.getElementById('budget-warning');

    const updateCategoryDropdown = (dropdown) => {
        const selectedCategories = [];
        expenseItems.querySelectorAll('.expense-category-dropdown').forEach((d) => {
            const selectedValue = d.value;
            if (selectedValue && selectedValue !== 'Other') {
                selectedCategories.push(selectedValue);
            }
        });
        dropdown.querySelectorAll('option').forEach((option) => {
            if (option.value !== 'Other' && selectedCategories.includes(option.value)) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    };

    const calculateTotal = (selector) =>
        Array.from(selector.querySelectorAll('input[type="number"]')).reduce(
            (sum, input) => sum + (parseFloat(input.value) || 0),
            0
        );

    const updateBudget = () => {
        const totalIncome = calculateTotal(incomeItems);
        const totalExpenses = calculateTotal(expenseItems);
        const remainingBudget = totalIncome - totalExpenses;

        totalIncomeEl.textContent = totalIncome.toFixed(2);
        totalExpensesEl.textContent = totalExpenses.toFixed(2);
        remainingBudgetEl.textContent = remainingBudget.toFixed(2);

        budgetWarning.classList.toggle('d-none', remainingBudget >= 0);
        updateCharts(totalIncome, totalExpenses);
    };

    const updateCharts = (totalIncome, totalExpenses) => {
        if (pieChartInstance) pieChartInstance.destroy();

        pieChartInstance = new Chart(document.getElementById('pie-chart'), {
            type: 'pie',
            data: {
                labels: ['Expenses', 'Remaining'],
                datasets: [
                    {
                        data: [totalExpenses, totalIncome - totalExpenses],
                        backgroundColor: ['#ff6384', '#36a2eb'],
                    },
                ],
            },
        });

        if (categoryPieChartInstance) categoryPieChartInstance.destroy();

        const categories = [];
        const amounts = [];
        expenseItems.querySelectorAll('div.row').forEach((row) => {
            const category = row.querySelector('.expense-category-dropdown').value || 'Other';
            const amount = parseFloat(row.querySelector('input[type="number"]').value) || 0;
            if (category && amount > 0) {
                categories.push(category);
                amounts.push(amount);
            }
        });

        if (categories.length > 0) {
            categoryPieChartInstance = new Chart(document.getElementById('category-pie-chart'), {
                type: 'pie',
                data: {
                    labels: categories,
                    datasets: [
                        {
                            data: amounts,
                            backgroundColor: ['#FF5733', '#FFC300', '#DAF7A6', '#33FF57'],
                        },
                    ],
                },
            });
        }
    };

    document.getElementById('add-income').addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'row mb-2';
        row.innerHTML = `
            <div class="col-6"><input type="text" class="form-control" placeholder="Income Source"></div>
            <div class="col-4"><input type="number" class="form-control" placeholder="Amount"></div>
            <div class="col-2"><button class="btn btn-danger remove-button">Remove</button></div>
        `;
        incomeItems.appendChild(row);
        row.querySelector('.remove-button').addEventListener('click', () => {
            row.remove();
            updateBudget();
        });
    });

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
            <div class="col-4"><input type="number" class="form-control" placeholder="Amount"></div>
            <div class="col-2"><button class="btn btn-danger remove-button">Remove</button></div>
        `;
        expenseItems.appendChild(row);
        row.querySelector('.remove-button').addEventListener('click', () => {
            row.remove();
            updateBudget();
        });
    });

    incomeItems.addEventListener('input', updateBudget);
    expenseItems.addEventListener('input', updateBudget);
});
