<?php
session_start();

$emailError = '';
$successMessage = '';
$showOTPForm = false;
$showPasswordForm = false;

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['email'])) {
    $email = $_POST['email'];
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !str_ends_with($email, '@spist.edu.ph')) {
        $emailError = 'No account Exists';
    } else {
        $otp = rand(100000, 999999);
        $_SESSION['reset_otp'] = $otp;
        $_SESSION['otp_expiry'] = time() + 300;
        $_SESSION['reset_email'] = $email;
        
        $showOTPForm = true;
        $successMessage = 'OTP has been sent to your email! (Simulated OTP: ' . $otp . ')';
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['otp'])) {
    $userOTP = $_POST['otp'];
    
    if (isset($_SESSION['reset_otp']) && $userOTP == $_SESSION['reset_otp'] && time() < $_SESSION['otp_expiry']) {
        $showPasswordForm = true;
        $successMessage = 'OTP verified! Please set your new password';
    } else {
        $emailError = 'Invalid OTP or OTP has expired';
        $showOTPForm = true;
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['new_password'])) {
    $newPassword = $_POST['new_password'];
    $confirmPassword = $_POST['confirm_password'];
    
    if ($newPassword !== $confirmPassword) {
        $emailError = 'Passwords do not match';
        $showPasswordForm = true;
    } else if (strlen($newPassword) < 8 || !preg_match('/[A-Z]/', $newPassword) || 
               !preg_match('/[0-9]/', $newPassword) || !preg_match('/[^A-Za-z0-9]/', $newPassword)) {
        $emailError = 'Password must be 8+ chars with uppercase, number & special char';
        $showPasswordForm = true;
    } else {
        $successMessage = 'Password has been reset successfully! (Simulated)';
        unset($_SESSION['reset_email'], $_SESSION['reset_otp'], $_SESSION['otp_expiry']);
        header("Refresh:3; url=../login/index.php");
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
        <input type="text" name="otp" placeholder="Enter 6-digit OTP" required maxlength="6">
        <i class='bx bxs-lock-alt'></i>
      </div>
      <div class="resend-info">
        <p>Didn't receive OTP? <button type="submit" name="resend_otp" class="resend-btn">Resend OTP</button></p>
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