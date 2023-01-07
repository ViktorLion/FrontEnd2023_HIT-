const form = document.getElementById("expense-form");
const dateForm = document.getElementById("expense-date");
const table = document.querySelector("table");
loadExpenses();
const priceInput = form.elements.price;


let counter =0;



priceInput.addEventListener("input", () => {
  const price = priceInput.value;
  if (!Number.isInteger(+price)) {
    priceInput.style.borderColor = "red";
  } else {
    priceInput.style.borderColor = "";
  }
});


function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  

let row;
form.addEventListener("submit", event => {
  event.preventDefault();

  // Get the values from the form inputs
  let id = counter++//uuidv4();
  const name = form.elements.name.value;
  const price = form.elements.price.value;
  let date = form.elements.date.value;
  const description = form.elements.description.value;
  const category = form.elements.category.value;

  // Validate the price input
  if (!Number.isInteger(+price)) {
    // Stop the form submission
    return;
  }
  
  // Set the date to the current date if it wasn't set
  if (!date) {
    const today = new Date();
    date = today.toISOString().substr(0, 10);
  }

  // Create a new expense object
  const expense = { id, name, price, date, description, category };
  
  // Save the expense to local storage
  var expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  // Add the expense to the table
  
  form.reset();
  // Load the expenses from local storage
  loadExpenses();
});

function loadExpenses() {
    table.innerHTML = '';
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.forEach(expense => {
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


table.addEventListener("click", event => {
if (event.target.className === "delete") {
    // Get the row element that contains the delete button
    const row = event.target.parentNode.parentNode;
    const id = row.cells[1].textContent;
    // Get the expense object associated with the row
    // Remove the expense from local storage
    removeExpense(id);
    console.log(id)
    // Remove the row from the table
    row.remove();
}
});

function removeExpense(id) {
    // Get the expenses from local storage
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const index = expenses.findIndex(expense => expense.id === id);

    // Remove the expense from the array
    expenses.splice(index, 1);

    // Save the updated expenses array to local storage
    localStorage.setItem("expenses", JSON.stringify(expenses));
}


//Show date functionality 

dateForm.addEventListener("submit", event => {
  event.preventDefault();
  
  // Get the values from the form inputs
  
  const startDate = dateForm.elements.startDate.value;
  const endDate = dateForm.elements.endDate.value;
  console.log(startDate)
  console.log(endDate)

  // Load the expenses from local storage
  loadDateExpenses(startDate, endDate);
})

function loadDateExpenses(startDate, endDate) {
    table.innerHTML = '';
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
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