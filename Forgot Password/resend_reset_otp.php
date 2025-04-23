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
    if (!isset($_SESSION['reset_email'])) {
        throw new Exception('Password reset session expired. Please start over.');
    }

    $email = $_SESSION['reset_email'];
    $otp = rand(100000, 999999);
    $_SESSION['reset_otp'] = $otp;
    $_SESSION['otp_expiry'] = time() + 300; // 5 minutes expiry

    // Update OTP in database
    $updateStmt = $conn->prepare("UPDATE user SET OTP = ? WHERE Email = ?");
    $updateStmt->bind_param("ss", $otp, $email);
    
    if (!$updateStmt->execute()) {
        throw new Exception('Failed to update OTP in database');
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

        $mail->setFrom('spistlms@gmail.com', 'Password Reset');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Your New Password Reset OTP';
        $mail->Body = "Your new OTP code is <strong>$otp</strong>. This code will expire in 5 minutes.";

        $mail->send();
        
        $response = [
            'success' => true,
            'message' => 'New OTP sent successfully!'
        ];
    } catch (Exception $e) {
        throw new Exception('Failed to send OTP email: ' . $e->getMessage());
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code(400);
}

echo json_encode($response);