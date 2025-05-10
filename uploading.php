<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "photography_website";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $category = $_POST["category"];

    // Upload image to 'uploads' folder
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["file"]["name"]);

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
        // Image uploaded successfully, insert data into the database
        $sql = "INSERT INTO uploads (file, category) VALUES ('" . $target_file . "', '" . $category . "')";

        if ($conn->query($sql) === TRUE) {
            echo "Image uploaded and data inserted successfully.";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Error uploading image.";
    }
}

// Fetch image paths from the database
$sql = "SELECT file, category FROM uploads";
$result = $conn->query($sql);

$imagePaths = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $file = $row["file"];
        $category = $row["category"];

        $imagePaths[] = [
            'file' => $file,
            'category' => $category
        ];
    }
}

// Return image paths as JSON
header('Content-Type: application/json');
echo json_encode($imagePaths);

$conn->close();
?>
