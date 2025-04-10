<?php
session_start();
include '../php/connection.php';

// Cleanup unverified users older than 1 hour
$conn->query("DELETE FROM user WHERE `is_verified` = 0 AND is_verified = 0  AND created_at < NOW() - INTERVAL 1 HOUR");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $email = $_POST['email'] ?? $username;

    // Check for unverified user
    $stmt = $conn->prepare("SELECT UserID FROM user WHERE (Email = ? OR FirstName = ?) AND `is_verified` = 0");
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();

    if ($stmt->get_result()->num_rows > 0) {
        $deleteStmt = $conn->prepare("DELETE FROM user WHERE (Email = ? OR FirstName = ?) AND `is_verified` = 0");
        $deleteStmt->bind_param("ss", $email, $username);
        $deleteStmt->execute();
        echo "<script>alert('Your previous registration wasn\'t completed. Please register again.'); window.location.href='../register/register.php';</script>";
        exit();
    }

    // Check admin table
    $adminStmt = $conn->prepare("SELECT AdminID AS id, AdminPassword AS password FROM admin WHERE AdminUsername = ?");
    $adminStmt->bind_param("s", $username);
    $adminStmt->execute();
    $adminResult = $adminStmt->get_result();

    if ($adminResult->num_rows === 1) {
        $adminRow = $adminResult->fetch_assoc();
        if ($password === $adminRow['password']) {
            $_SESSION['user_id'] = $adminRow['id'];
            header("Location: ../admin/adminHP.php");
            exit();
        }
    }

    // Check user table
    $userStmt = $conn->prepare("SELECT UserID AS id, Password AS password FROM user WHERE Email = ? AND `is_verified` = 1");
    $userStmt->bind_param("s", $username);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 1) {
        $userRow = $userResult->fetch_assoc();
        if (password_verify($password, $userRow['password'])) {
            $_SESSION['user_id'] = $userRow['id'];
            header("Location: ../user/user.php");
            exit();
        }
    }

    // If no matches found
    echo "<script>alert('Invalid username or password. Please try again.'); window.location.href='../login/index.php';</script>";
    exit();
}
?>