<?php
session_start();
include '../php/connection.php';

// Check if OTP verification is in progress
if (!isset($_SESSION['otp_verification']) || !isset($_SESSION['temp_user_id'])) {
    header("Location: ../login/index.php");
    exit();
}

// Get user email for display
$user_id = $_SESSION['temp_user_id'];
$stmt = $conn->prepare("SELECT Email, FirstName FROM user WHERE UserID = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user_data = $result->fetch_assoc();
$user_email = $user_data['Email'] ?? 'your email';
$first_name = $user_data['FirstName'] ?? 'User';

// Check for error message
$error = isset($_GET['error']) ? urldecode($_GET['error']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <link rel="stylesheet" href="../register/register.css">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
  <img src="../photos/lmslogo.png" alt="lmslogo" class="lmslogo">
  <div class="logochange">
    <img src="../photos/logo.jpg" alt="Logo" class="logoslot">
  </div>
  <div class="wrapper">
    <img src="../photos/logo.jpg" alt="Logo" class="logo">
    <form id="otp-form" method="POST" action="../login/login.php">
      <h1>VERIFY YOUR LOGIN</h1>
      
      <?php if (!empty($error)): ?>
        <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>
      
      <div class="otp-info">
        <p>We've sent a 6-digit verification code to:</p>
        <div class="email-display">
          <i class='bx bxs-envelope'></i>
          <span><?php echo htmlspecialchars($user_email); ?></span>
        </div>
      </div>
      
      <div class="input-box">
        <input type="text" name="otp" id="otp" placeholder="Enter 6-digit OTP" required maxlength="6" pattern="\d{6}">
        <i class='bx bxs-lock-alt' aria-label="OTP Icon"></i>
      </div>
      
      <button type="submit" class="btn">Verify</button>

      <div class="resend-info">
        <p>Didn't receive the code? <a href="#" id="resend-otp">Resend OTP</a></p>
      </div>
    </form>
  </div>
  
  <script src="../login/login_otp.js"></script>
</body>
</html>