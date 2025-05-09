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
    // Check if registration is in progress
    if (!isset($_SESSION['registration_in_progress'])) {
        throw new Exception('Registration session expired. Please start over.');
    }

    if (!isset($_SESSION['register_email']) || !isset($_SESSION['register_data'])) {
        throw new Exception('Registration data not found. Please try registering again.');
    }

    $email = $_SESSION['register_email'];
    $firstname = $_SESSION['register_data']['firstname'];

    // Generate new OTP (same as in register.php)
    $otp = rand(100000, 999999);

    // Update OTP in database (same as initial registration)
    $updateStmt = $conn->prepare("UPDATE user SET OTP = ?, created_at = NOW() WHERE Email = ?");
    if (!$updateStmt) {
        throw new Exception('Database preparation failed: ' . $conn->error);
    }
    
    $updateStmt->bind_param("ss", $otp, $email);
    if (!$updateStmt->execute()) {
        throw new Exception('Failed to update OTP in database: ' . $updateStmt->error);
    }

    // Send OTP email (same as in register.php)
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'spistlms@gmail.com';
        $mail->Password = 'vcda bcuo xlyq rxiq';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('spistlms@gmail.com', 'OTP Email Service');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Your New OTP Code';
        $mail->Body = "<p>Hi $firstname,<br>Your new OTP code is <strong>$otp</strong>.</p>";

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
} finally {
    if (isset($updateStmt)) $updateStmt->close();
    if (isset($conn)) $conn->close();
}

echo json_encode($response);
?>