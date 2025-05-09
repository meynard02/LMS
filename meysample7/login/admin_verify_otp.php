<?php
session_start();
include '../php/connection.php';

// Check if OTP verification is in progress
if (!isset($_SESSION['admin_otp_verification']) || !isset($_SESSION['temp_admin_id'])) {
    header("Location: ../login/index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $otp = $_POST['otp'] ?? '';
    $admin_id = $_SESSION['temp_admin_id'] ?? 0;
    
    // Verify OTP
    $stmt = $conn->prepare("SELECT AdminID FROM admin WHERE AdminID = ? AND AdminOTP = ?");
    $stmt->bind_param("is", $admin_id, $otp);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows === 1) {
        // OTP is valid, clear OTP and log admin in
        $conn->query("UPDATE admin SET AdminOTP = NULL WHERE AdminID = $admin_id");
        
        $_SESSION['user_id'] = $admin_id;
        $_SESSION['user_type'] = 'admin';
        unset($_SESSION['temp_admin_id']);
        unset($_SESSION['admin_otp_verification']);
        
        header("Location: ../admin/adminHP.php");
        exit();
    } else {
        header("Location: ../login/admin_login_otp.php?error=" . urlencode("Invalid OTP. Please try again."));
        exit();
    }
}

header("Location: ../login/index.php");
exit();
?>