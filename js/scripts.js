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
    // Get the expense object associated with the row
    // Remove the expense from local storage
    Expense.prototype.removeExpense(id);

    // Remove the row from the table
    row.remove();

    // Reload the chart
    utilsnamespaces.chart.setAndGetChart(utilsnamespaces.total);
}
});

function removeExpense(id) {
    
    // Get the expenses from local storage
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    //console.log(expenses)
    // Create a new array with the expenses that have an ID different from the given ID
    const filteredExpenses = expenses.filter(expense =>
        expense.id != id 
        );

    // Save the updated expenses array to local storage
    localStorage.setItem("expenses", JSON.stringify(filteredExpenses));
  }


//Show date functionality 

dateForm.addEventListener("submit", event => {
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
    filteredExpenses.forEach(expense => {
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


//chart

function loadChartExpenses(startDate, endDate) {
    if(!startDate){
        startDate =  "2020-01-01"
    }
    if(!endDate){
        endDate =  "2025-01-01"
    }
    // Get the expenses from local storage
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    // Count the number of expenses in each category
    const categories = {};
    let totalSum = 0
    expenses.forEach(expense => {
    if (!startDate || !endDate || (expense.date >= startDate && expense.date <= endDate)) {
      totalSum += (+expense.price)
      if (categories[expense.category]) {
        categories[expense.category] += (+expense.price);
      } else {
        categories[expense.category] = (+expense.price);
      }
    }
    total.textContent = `Total:${totalSum}` 
    console.log(totalSum)

});
  
    // Get the labels and data for the pie chart
    const labels = [];
    const data = [];
    for (const category in categories) {
      labels.push(category);
    data.push(categories[category]);
    }
  
    // Get the pie chart canvas element
    const pieChartCanvas = document.getElementById("pie-chart");
  
    // Create the pie chart
    new Chart(pieChartCanvas, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Expenses by Category",
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.7)",
                "rgba(54, 162, 235, 0.7)",
                "rgba(255, 206, 86, 0.7)",
                "rgba(75, 192, 192, 0.7)",
                "rgba(153, 102, 255, 0.7)",
                "rgba(255, 159, 64, 0.7)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 3
            }
          ]
        },
        options: {
          legend: {
            position: "bottom"
          }, 
          //tooltips: true
        }
      })
    }
    
    