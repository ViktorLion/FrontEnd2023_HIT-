// Viktor Rokytko - 336484951
// May Vakrat - 205735657

import { Expense } from "./expense.js";
import { ExpenseChart } from "./chart.js";

let utilsnamespaces = {};
utilsnamespaces.form = document.getElementById("expense-form");
utilsnamespaces.dateForm = document.getElementById("expense-date");
utilsnamespaces.table = document.querySelector("table");
utilsnamespaces.total = document.getElementById("total")
utilsnamespaces.priceInput = utilsnamespaces.form.elements.price;
utilsnamespaces.chart = new ExpenseChart();


// Event listeners

utilsnamespaces.priceInput.addEventListener("input", () => {
    const price = utilsnamespaces.priceInput.value;
    if (!Number.isInteger(+price)) {
        utilsnamespaces.priceInput.style.border  = "3px solid red";
    } else {
        utilsnamespaces.priceInput.style.border  = "";
    }
});


utilsnamespaces.form.addEventListener("submit", event => {
    event.preventDefault();

    // Get the values from the form inputs
    const name = utilsnamespaces.form.elements.name.value;
    let price = utilsnamespaces.form.elements.price.value;
    let date = utilsnamespaces.form.elements.date.value;
    const description = utilsnamespaces.form.elements.description.value;
    const category = utilsnamespaces.form.elements.category.value;

    // Create a new expense object
    const expense = new Expense(name, price, date, description, category);

    // Save the expense to local storage
    Expense.prototype.saveExpense(expense);

    // Add the expense to the table
    utilsnamespaces.form.reset();

    // Load the expenses from local storage
    loadTable();
    utilsnamespaces.chart.setAndGetChart(utilsnamespaces.total);
});


utilsnamespaces.table.addEventListener("click", event => {
    if (event.target.className === "delete") {
        // Get the row element that contains the delete button
        const row = event.target.parentNode.parentNode;

        // Get the id of expense object within the row
        const id = row.cells[1].textContent;

        // Remove the expense from local storage
        Expense.prototype.removeExpense(id);

        // Remove the row from the table
        row.remove();

        // Reload the chart
        utilsnamespaces.chart.setAndGetChart(utilsnamespaces.total);
    }
});


// Show date functionality
utilsnamespaces.dateForm.addEventListener("submit", event => {
    event.preventDefault();

    // Get the values from the form inputs
    const startDate = utilsnamespaces.dateForm.elements.startDate.value;
    const endDate = utilsnamespaces.dateForm.elements.endDate.value;

    // Load the expenses from local storage
    filterTable(startDate, endDate);
    utilsnamespaces.chart.setAndGetChart(startDate, endDate, utilsnamespaces.total);
});


//Functions

function loadTable() {
    const expenses = Expense.prototype.loadExpenses();
    Expense.prototype.loadExpenseTable(utilsnamespaces.table, expenses);
}


function filterTable(startDate, endDate) {
    if(!startDate){
        startDate =  "2020-01-01"
    }
    if(!endDate){
        endDate =  "2025-01-01"
    }

    const expenses = Expense.prototype.loadExpenses();

    // Filter the expenses by the given dates
    const filteredExpenses = expenses.filter(expense => {
        return expense.date >= startDate && expense.date <= endDate;
    });

    Expense.prototype.loadExpenseTable(utilsnamespaces.table, filteredExpenses)
}


//Load table
loadTable();
