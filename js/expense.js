
export const Expense = function (name, price, date, description, category) {
    this.name = name;
    this.price = Expense.prototype.validatePrice(price);
    this.date = Expense.prototype.validateDate(date);
    this.description = description;
    this.category = category;
    this.id = Expense.prototype.createId();
}

Expense.prototype.createId = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

Expense.prototype.validatePrice = function (price) {
    if (!Number.isInteger(+price)) {
        // Stop the form submission
        return;
    }
    else if (price === '') {
        return  0;
    }
    else {
        return price;
    }
}

Expense.prototype.validateDate = function (date) {
    if (!date) {
        const today = new Date();
        return today.toISOString().substring(0, 10);
    }
    else {
        return date;
    }
}

Expense.prototype.saveExpense = function (expense) {
    // Save the expense to local storage
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

Expense.prototype.loadExpenses = function () {
   return JSON.parse(localStorage.getItem("expenses")) || [];
}

Expense.prototype.removeExpense = function (id) {
    // Get the expenses from local storage
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    console.log(expenses)

    // Create a new array with the expenses that have an ID different from the given ID
    const filteredExpenses = expenses.filter(expense =>
        expense.id !== id
    );

    // Save the updated expenses array to local storage
    localStorage.setItem("expenses", JSON.stringify(filteredExpenses));
}

Expense.prototype.loadExpenseTable = function (table, expenseJson) {
    table.innerHTML = `
    <tr>
    <th>Date</th>
    <th>ID</th>
    <th>Name</th>
    <th>Category</th>
    <th>Description</th>
    <th>Price</th>
  </tr>`;

    expenseJson.forEach(expense => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${expense.date}</td>
        <td>${expense.id}</td>
        <td>${expense.name}</td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        <td>${expense.price}</td>
        <td><button class="delete">Delete</button></td>`;
        table.appendChild(row);
    });

}
