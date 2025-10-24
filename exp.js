let salary = 0;
let expenses = [];
let filteredExpenses = [];

// Load initial data
function loadData() {
    updateUI();
}

function setSalary() {
    const salaryInput = document.getElementById('salary');
    const newSalary = parseFloat(salaryInput.value);
    if (!newSalary || newSalary <= 0) {
        alert('Please enter a valid salary amount');
        return;
    }
    salary = newSalary;
    salaryInput.value = '';
    updateUI();
}

function addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (!description.trim()) {
        alert('Please enter a description');
        return;
    }

    const expense = {
        id: Date.now(),
        amount,
        category,
        description: description.trim(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleString()
    };

    expenses.unshift(expense);

    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    updateUI();
}

function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        updateUI();
    }
}

function updateUI() {
    updateBudgetOverview();
    updateCategoryBreakdown();
    updateExpensesList();
}

function updateBudgetOverview() {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = salary - totalSpent;
    const spentPercentage = salary > 0 ? (totalSpent / salary) * 100 : 0;

    document.getElementById('totalSalary').textContent = `₹${salary.toLocaleString()}`;
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString()}`;
    document.getElementById('remaining').textContent = `₹${remaining.toLocaleString()}`;

    const remainingEl = document.getElementById('remaining');
    remainingEl.className = 'amount remaining ';
    if (remaining < salary * 0.2) remainingEl.className += 'low';
    else if (remaining < salary * 0.5) remainingEl.className += 'medium';
    else remainingEl.className += 'high';

    document.getElementById('progressFill').style.width = Math.min(spentPercentage, 100) + '%';
}

function updateCategoryBreakdown() {
    const categoryTotals = {};
    expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const categoryList = document.getElementById('categoryList');
    if (Object.keys(categoryTotals).length === 0) {
        categoryList.innerHTML = '<div class="no-expenses">No expenses recorded yet</div>';
        return;
    }

    const labels = {
        food: '🍽️ Food',
        groceries: '🛒 Groceries',
        travel: '🚗 Travel',
        entertainment: '🎬 Entertainment',
        utilities: '💡 Utilities',
        healthcare: '🏥 Healthcare',
        other: '📝 Other'
    };

    categoryList.innerHTML = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amt]) => `
            <div class="category-item">
                <span class="category-name">${labels[cat]}</span>
                <span class="category-amount">₹${amt.toLocaleString()}</span>
            </div>
        `).join('');
}

function updateExpensesList() {
    const list = document.getElementById('expensesList');
    const display = filteredExpenses.length ? filteredExpenses : expenses;

    if (!display.length) {
        list.innerHTML = '<div class="no-expenses">No expenses to display</div>';
        return;
    }

    list.innerHTML = display.map(e => `
        <div class="expense-item">
            <div class="expense-info">
                <div class="expense-description">${e.description}</div>
                <div class="expense-meta">
                    ${e.timestamp}
                    <span class="category-badge ${e.category}">${e.category}</span>
                </div>
            </div>
            <div class="expense-amount">₹${e.amount.toLocaleString()}</div>
            <button class="btn btn-danger" onclick="deleteExpense(${e.id})">Delete</button>
        </div>
    `).join('');
}

function filterExpenses() {
    const date = document.getElementById('filterDate').value;
    filteredExpenses = date ? expenses.filter(e => e.date === date) : [];
    updateExpensesList();
}

function clearFilter() {
    document.getElementById('filterDate').value = '';
    filteredExpenses = [];
    updateExpensesList();
}

loadData();
