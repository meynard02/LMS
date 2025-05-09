<?php
session_start();
header('Content-Type: application/json');
require '../php/connection.php';
require '../PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$response = ['success' => false, 'message' => ''];

try {
    // Check if OTP verification is in progress
    if (!isset($_SESSION['otp_verification']) || !isset($_SESSION['temp_user_id'])) {
        throw new Exception('Session expired. Please login again.');
    }

    $user_id = $_SESSION['temp_user_id'];
    
    // Get user details
    $stmt = $conn->prepare("SELECT Email, FirstName FROM user WHERE UserID = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows !== 1) {
        throw new Exception('User not found.');
    }
    
    $user = $result->fetch_assoc();
    $email = $user['Email'];
    $firstname = $user['FirstName'];
    
    // Generate new OTP
    $otp = rand(100000, 999999);
    
    // Update OTP in database
    $updateStmt = $conn->prepare("UPDATE user SET OTP = ? WHERE UserID = ?");
    $updateStmt->bind_param("si", $otp, $user_id);
    
    if (!$updateStmt->execute()) {
        throw new Exception('Failed to update OTP in database.');
    }
    
    // Send OTP email
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'spistlms@gmail.com';
        $mail->Password = 'vcda bcuo xlyq rxiq';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('spistlms@gmail.com', 'OTP Verification');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Your New Login OTP Code';
        $mail->Body = "<p>Hi $firstname,<br>Your new login OTP code is <strong>$otp</strong>.</p>";

        if (!$mail->send()) {
            throw new Exception('Failed to send OTP email.');
        }

        $response = [
            'success' => true,
            'message' => 'New OTP sent successfully!'
        ];

    } catch (Exception $e) {
        throw new Exception('Email sending failed: ' . $e->getMessage());
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code(400);
}

echo json_encode($response);
?>