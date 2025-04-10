<?php
session_start();
include '../php/connection.php';

if (isset($_SESSION['registration_in_progress'])) {
    $email = $_SESSION['register_email'] ?? '';
    
    if (!empty($email)) {
        $stmt = $conn->prepare("DELETE FROM user WHERE Email = ? AND OTP IS NOT NULL");
        $stmt->bind_param("s", $email);
        $stmt->execute();
    }
    
    session_unset();
    session_destroy();
}

header("Location: ../register/register.php");
exit();
?>