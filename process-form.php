<?php

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Get the form data
  $name = $_POST["name"];
  $price = $_POST["price"];
  $date = $_POST["date"];
  $description = $_POST["description"];
  $category = $_POST["category"];

  // Validate the form data (optional)
  // ...

  // Save the expense to a database or file (optional)
  // ...

  // Redirect to the expenses page
  header("Location: expenses.php");
  exit;
}

?>