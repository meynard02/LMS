<?php
session_start();
include '../php/connection.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';

// Handle OTP resend request
if (isset($_GET['resend']) && $_GET['resend'] === 'true') {
    require 'resend_reset_otp.php';
    exit;
}

$emailError = '';
$successMessage = '';
$showOTPForm = false;
$showPasswordForm = false;

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['email'])) {
    $email = $_POST['email'];
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $emailError = 'Invalid email format';
    } elseif (!str_ends_with($email, '@spist.edu.ph')) {
        $emailError = 'Only @spist.edu.ph emails are allowed';
    } else {
        $stmt = $conn->prepare("SELECT UserID FROM user WHERE Email = ? AND is_verified = 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $emailError = 'No account exists with this email';
        } else {
            $otp = rand(100000, 999999);
            $_SESSION['reset_otp'] = $otp;
            $_SESSION['otp_expiry'] = time() + 300;
            $_SESSION['reset_email'] = $email;
            
            $updateStmt = $conn->prepare("UPDATE user SET OTP = ? WHERE Email = ?");
            $updateStmt->bind_param("ss", $otp, $email);
            $updateStmt->execute();
            
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
                $mail->Subject = 'Your Password Reset OTP';
                $mail->Body = "Your OTP code is <strong>$otp</strong>. Valid for 5 minutes.";

                $mail->send();
                $showOTPForm = true;
                $successMessage = 'OTP has been sent to your email!';
            } catch (Exception $e) {
                $emailError = 'Failed to send OTP. Please try again.';
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['otp'])) {
    $userOTP = $_POST['otp'];
    
    if (!isset($_SESSION['reset_otp']) || !isset($_SESSION['otp_expiry'])) {
        $emailError = 'OTP session expired. Please start over.';
    } elseif (time() > $_SESSION['otp_expiry']) {
        $emailError = 'OTP has expired. Please request a new one.';
        $showOTPForm = true;
    } elseif ($userOTP == $_SESSION['reset_otp']) {
        $showPasswordForm = true;
        $successMessage = 'OTP verified! Please set your new password';
    } else {
        $emailError = 'Invalid OTP';
        $showOTPForm = true;
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['new_password'])) {
    $newPassword = $_POST['new_password'];
    $confirmPassword = $_POST['confirm_password'];
    
    if ($newPassword !== $confirmPassword) {
        $emailError = 'Passwords do not match';
        $showPasswordForm = true;
    } else {
        $errors = [];
        if (strlen($newPassword) < 8) $errors[] = '8+ characters';
        if (!preg_match('/[A-Z]/', $newPassword)) $errors[] = '1 uppercase letter';
        if (!preg_match('/[0-9]/', $newPassword)) $errors[] = '1 number';
        if (!preg_match('/[^A-Za-z0-9]/', $newPassword)) $errors[] = '1 special character';
        
        if (!empty($errors)) {
            $emailError = 'Password requires: ' . implode(', ', $errors);
            $showPasswordForm = true;
        } else {
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            $stmt = $conn->prepare("UPDATE user SET Password = ? WHERE Email = ?");
            $stmt->bind_param("ss", $hashedPassword, $_SESSION['reset_email']);
            
            if ($stmt->execute()) {
                $successMessage = 'Password updated successfully! Redirecting...';
                unset($_SESSION['reset_email'], $_SESSION['reset_otp'], $_SESSION['otp_expiry']);
                header("Refresh:3; url=../login/index.php");
            } else {
                $emailError = 'Failed to update password';
                $showPasswordForm = true;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot Password</title>
  <link rel="stylesheet" href="FP.css">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
  <img src="../photos/lmslogo.png" alt="lmslogo" class="lmslogo">
  <div class="logochange">
    <img src="../photos/logo.jpg" alt="Logo" class="logoslot">
  </div>
  <div class="wrapper">
    <img src="../photos/logo.jpg" alt="Logo" class="logo">
    
    <?php if (!empty($successMessage)): ?>
      <div class="custom-message success">
        <?= $successMessage ?>
      </div>
    <?php endif; ?>
    
    <?php if (!empty($emailError)): ?>
      <div class="custom-message error">
        <?= $emailError ?>
      </div>
    <?php endif; ?>
    
    <?php if (!$showOTPForm && !$showPasswordForm): ?>
    <form id="forgot-form" method="POST">
      <h1>RESET YOUR PASSWORD</h1>
      <div class="input-box">
        <input type="email" name="email" placeholder="Enter your @spist.edu.ph email" required>
        <i class='bx bxs-envelope'></i>
      </div>
      <button type="submit" class="btn">Send OTP</button>
      <div class="login-link">
        <p>Remember your password? <a href="../login/index.php">Login</a></p>
      </div>
    </form>
    <?php endif; ?>
    
    <?php if ($showOTPForm && !$showPasswordForm): ?>
    <form id="otp-form" method="POST">
      <h1>VERIFY YOUR OTP</h1>
      <div class="input-box">
        <input type="text" name="otp" placeholder="Enter 6-digit OTP" required maxlength="6" pattern="\d{6}">
        <i class='bx bxs-lock-alt'></i>
      </div>
      <div class="resend-info">
        <p>Didn't receive OTP? <a href="#" id="resend-otp">Resend OTP</a></p>
        <p id="countdown">OTP expires in: 5:00</p>
      </div>
      <button type="submit" class="btn">Verify OTP</button>
    </form>
    <?php endif; ?>
    
    <?php if ($showPasswordForm): ?>
    <form id="password-form" method="POST">
      <h1>SET NEW PASSWORD</h1>
      <div class="input-box">
        <input type="password" name="new_password" id="new_password" placeholder="New Password" required
               pattern="(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}"
               title="Must contain: 8+ chars, 1 uppercase, 1 number, 1 special char">
        <i class='bx bx-hide toggle-password' id="toggleNewPassword"></i>
        <div class="password-strength">
          <div class="strength-bar"></div>
        </div>
        <div class="strength-text"></div>
      </div>
      <div class="input-box">
        <input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Password" required>
        <i class='bx bx-hide toggle-password' id="toggleConfirmPassword"></i>
      </div>
      <button type="submit" class="btn">Reset Password</button>
    </form>
    <?php endif; ?>
  </div>
  <script src="FP.js"></script>
</body>
</html>