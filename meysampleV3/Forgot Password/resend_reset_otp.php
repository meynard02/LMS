<?php
session_start();
header('Content-Type: application/json');

// Check if the request is AJAX
if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'Invalid request']));
}

require '../php/connection.php';
require '../PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Initialize response array
$response = ['success' => false, 'message' => ''];

try {
    // Check if reset session exists
    if (!isset($_SESSION['reset_email'])) {
        throw new Exception('Password reset session expired. Please start over.');
    }

    // Get user details
    $email = $_SESSION['reset_email'];
    $stmt = $conn->prepare("SELECT FirstName FROM user WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows !== 1) {
        throw new Exception('User not found.');
    }
    
    $user = $result->fetch_assoc();
    $firstname = $user['FirstName'];
    
    // Generate new OTP
    $otp = rand(100000, 999999);
    
    // Update session with new OTP and expiry
    $_SESSION['reset_otp'] = $otp;
    $_SESSION['otp_expiry'] = time() + 300; // 5 minutes expiry

    // Update database
    $updateStmt = $conn->prepare("UPDATE user SET OTP = ? WHERE Email = ?");
    $updateStmt->bind_param("ss", $otp, $email);
    
    if (!$updateStmt->execute()) {
        throw new Exception('Failed to update OTP in database');
    }

    // Send email using the same method as in FP.php
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'spistlms@gmail.com';
        $mail->Password = 'vcda bcuo xlyq rxiq';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('spistlms@gmail.com', 'Password Reset');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Your New Password Reset OTP';
        $mail->Body = "<p>Hi $firstname,<br>Your new password reset OTP code is <strong>$otp</strong>. Valid for 5 minutes.</p>";

        if (!$mail->send()) {
            throw new Exception('Failed to send OTP email');
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

// Ensure only JSON is output
header('Content-Type: application/json');
echo json_encode($response);
exit();