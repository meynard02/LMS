<?php
session_start();
include '../php/connection.php'; // Include database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username']; // Username input
    $password = $_POST['password']; // Password input

    // Step 1: Check in the admin table
    $stmt = $conn->prepare("SELECT AdminID AS id, AdminPassword AS password, 'admin' AS role FROM admin WHERE AdminUsername = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // Step 2: If no admin found, check the user table
        $stmt = $conn->prepare("SELECT UserID AS id, Password AS password, 'user' AS role FROM user WHERE Email = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
    }

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        // Verify password
        if ($password === $row['password']) { // Non-hashed password comparison
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['role'] = $row['role'];

            // Redirect based on role
            if ($row['role'] === 'admin') {
                echo "<script>window.location.href = '../admin/adminHP.php';</script>";

            } else {
                echo "<script>window.location.href = '../user/user.php';</script>";
            }
            exit();
        } else {
            echo "<script>alert('Invalid password'); window.location.href = '../login/index.php';</script>";
            exit();
        }
    } else {
        echo "<script>alert('Invalid username'); window.location.href = '../login/index.php';</script>";
        exit();
    }
}
?>