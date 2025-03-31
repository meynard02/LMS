<?php
session_start();
include '../php/connection.php'; // Include database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username']; // Username input
    $password = $_POST['password']; // Password input

    // Step 1: Check in the admin table (plain text password)
    $stmt = $conn->prepare("SELECT AdminID AS id, AdminPassword AS password, 'admin' AS role FROM admin WHERE AdminUsername = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        
        // Direct comparison since admin password is NOT encrypted
        if ($password === $row['password']) {
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['role'] = 'admin';
            echo "<script>window.location.href = '../admin/adminHP.php';</script>";
            exit();
        }
    } 

    // Step 2: If no admin match, check the user table (hashed password)
    $stmt = $conn->prepare("SELECT UserID AS id, Password AS password, 'user' AS role FROM user WHERE Email = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        // Verify password using password_verify() since user passwords are hashed
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['role'] = 'user';
            echo "<script>window.location.href = '../user/user.php';</script>";
            exit();
        }
    }

    // If no match, show error
    echo "<script>alert('Invalid username or password'); window.location.href = '../login/index.php';</script>";
    exit();
}
?>
