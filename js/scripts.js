const form = document.getElementById("expense-form");
const dateForm = document.getElementById("expense-date");
const table = document.querySelector("table");
const total = document.getElementById("total")
const priceInput = form.elements.price;

loadExpenses();

priceInput.addEventListener("input", () => {
  const price = priceInput.value;
  if (!Number.isInteger(+price)) {
    priceInput.style.border  = "3px solid red";
  } else {
    priceInput.style.border  = "";
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
  let id = uuidv4();
  const name = form.elements.name.value;
  let price = form.elements.price.value;
  let date = form.elements.date.value;
  const description = form.elements.description.value;
  const category = form.elements.category.value;

  // Validate the price input
  if (!Number.isInteger(+price)) {
    // Stop the form submission
    return;
  }
  if (price == '') {
    price = 0;
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
  loadChartExpenses()
});

function loadExpenses() {
    table.innerHTML = ` 
    <tr>
    <th>Date</th>
    <th>ID</th>
    <th>Name</th>
    <th>Category</th>
    <th>Description</th>
    <th>Price</th>
  </tr>`;
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
    // Remove the expense from local storage
    removeExpense(id);
    
    // Remove the row from the table
    row.remove();
    loadChartExpenses()
}
});

function removeExpense(id) {
    
    // Get the expenses from local storage
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    
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
  
  const startDate = dateForm.elements.startDate.value;
  const endDate = dateForm.elements.endDate.value;
 

  // Load the expenses from local storage
  loadDateExpenses(startDate, endDate);
  loadChartExpenses(startDate, endDate)
})

function loadDateExpenses(startDate, endDate) {
    if(!startDate){
        startDate =  "2020-01-01"
    }
    if(!endDate){
        endDate =  "2025-01-01"
    }

    table.innerHTML = ` 
    <tr>
    <th>Date</th>
    <th>ID</th>
    <th>Name</th>
    <th>Category</th>
    <th>Description</th>
    <th>Price</th>
  </tr>`;
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
    total.textContent = `Total: ${totalSum}` 
    

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
    
    