<?php
session_start();
include '../php/connection.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';
header('Content-Type: application/json');

if (empty($_SESSION['register_email'])) {
    echo json_encode(['success' => false, 'message' => 'Session expired']);
    exit();
}

$email = $_SESSION['register_email'];
$otp = rand(100000, 999999);

// Update OTP in database
$sql = "UPDATE user SET OTP = ? WHERE Email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $otp, $email);

if ($stmt->execute()) {
    // Resend OTP email
    require '../PHPMailer-master/src/Exception.php';
    require '../PHPMailer-master/src/PHPMailer.php';
    require '../PHPMailer-master/src/SMTP.php';
    
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
        $mail->Body = "<p>Your new OTP code is <strong>$otp</strong>. Enter this code to complete your registration.</p>";

        $mail->send();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Mailer Error: '.$mail->ErrorInfo]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update OTP']);
}
?>