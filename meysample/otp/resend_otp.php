<?php
session_start();
header('Content-Type: application/json');
require '../php/connection.php';
require '../PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'next_resend' => null
];

try {
    // Validate session
    if (!isset($_SESSION['registration_in_progress'])) {
        throw new Exception('Registration session expired. Please start over.');
    }

    if (!isset($_SESSION['register_email'])) {
        throw new Exception('Email not found in session. Please try registering again.');
    }

    $email = $_SESSION['register_email'];

    // Check if user exists with pending OTP
    $stmt = $conn->prepare("SELECT FirstName, OTP, created_at FROM user WHERE Email = ? AND OTP IS NOT NULL");
    if (!$stmt) {
        throw new Exception('Database preparation failed: ' . $conn->error);
    }
    
    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) {
        throw new Exception('Database query failed: ' . $stmt->error);
    }

    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        throw new Exception('No pending registration found for this email. Please register again.');
    }

    $user = $result->fetch_assoc();
    $firstName = $user['FirstName'];
    $lastOtpTime = strtotime($user['created_at']);
    $currentTime = time();

    // Rate limiting (60 seconds between resends)
    if (($currentTime - $lastOtpTime) < 60) {
        $waitTime = 60 - ($currentTime - $lastOtpTime);
        throw new Exception("Please wait {$waitTime} more seconds before requesting a new OTP.");
    }

    // Generate new OTP
    $newOtp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    // Update OTP in database
    $updateStmt = $conn->prepare("UPDATE user SET OTP = ?, created_at = NOW() WHERE Email = ?");
    if (!$updateStmt) {
        throw new Exception('Database preparation failed: ' . $conn->error);
    }
    
    $updateStmt->bind_param("ss", $newOtp, $email);
    if (!$updateStmt->execute()) {
        throw new Exception('Failed to update OTP in database: ' . $updateStmt->error);
    }

    // Send OTP via email
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'spistlms@gmail.com';
        $mail->Password = 'vcda bcuo xlyq rxiq';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';

        // Recipients
        $mail->setFrom('spistlms@gmail.com', 'OTP Email Service');
        $mail->addAddress($email, $firstName);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Your New Verification Code';
        $mail->Body = "
            <h2>SPIST LMS Registration</h2>
            <p>Hello {$firstName},</p>
            <p>Your new verification code is: <strong>{$newOtp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        ";
        $mail->AltBody = "Your SPIST LMS verification code is: {$newOtp} (valid for 10 minutes)";

        if (!$mail->send()) {
            throw new Exception('Failed to send OTP email.');
        }

        // Success response
        $response = [
            'success' => true,
            'message' => 'New verification code sent successfully!',
            'next_resend' => $currentTime + 60
        ];

    } catch (Exception $e) {
        throw new Exception('Email sending failed: ' . $e->getMessage());
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code(400); // Bad request
} finally {
    // Close database connections if they exist
    if (isset($stmt)) $stmt->close();
    if (isset($updateStmt)) $updateStmt->close();
    if (isset($conn)) $conn->close();
}

echo json_encode($response);
?>