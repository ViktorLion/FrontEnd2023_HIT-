// Viktor Rokytko - 336484951
// May Vakrat - 205735657

import {Expense} from "./expense.js";

export const ExpenseChart = function(startDate, endDate, total) {
    // Get the pie chart canvas element
    this.pieChartCanvas = document.getElementById("pie-chart");
}

ExpenseChart.prototype.setAndGetChart = function (startDate, endDate, total) {
    if (!startDate) {
        startDate = "2020-01-01"
    }
    if (!endDate) {
        endDate = "2025-01-01"
    }
    // Get the expenses from local storage
    const expenses = Expense.prototype.loadExpenses();

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

    // Create the pie chart
    new Chart(this.pieChartCanvas, {
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