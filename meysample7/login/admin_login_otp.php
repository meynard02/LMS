<?php
session_start();
include '../php/connection.php';

// Check if OTP verification is in progress
if (!isset($_SESSION['admin_otp_verification']) || !isset($_SESSION['temp_admin_id'])) {
    header("Location: ../login/index.php");
    exit();
}

// Get admin email for display
$admin_email = $_SESSION['admin_email'] ?? 'your email';
$admin_fname = $_SESSION['admin_fname'] ?? 'Admin';

// Check for error message
$error = isset($_GET['error']) ? urldecode($_GET['error']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin OTP Verification</title>
  <link rel="stylesheet" href="../register/register.css">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
<div class="logofolder">  
    <img src="../photos/lmslogo.png" alt="lmslogo" class="lmslogo">
    <div class="logochange">
      <img src="../photos/logo.jpg" alt="Logo" class="logoslot">
    </div>
  </div>  
  <div class="wrapper">
    <img src="../photos/logo.jpg" alt="Logo" class="logo">
    <form id="otp-form" method="POST" action="../login/admin_verify_otp.php">
      <h1>ADMIN VERIFICATION</h1>
      
      <?php if (!empty($error)): ?>
        <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>
      
      <div class="otp-info">
        <p>We've sent a 6-digit verification code to:</p>
        <div class="email-display">
          <i class='bx bxs-envelope'></i>
          <span><?php echo htmlspecialchars($admin_email); ?></span>
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
  
  <script>
    // Resend OTP functionality
    document.getElementById('resend-otp').addEventListener('click', function(e) {
        e.preventDefault();
        
        fetch('../login/resend_admin_otp.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('New OTP sent successfully!');
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                alert('Error resending OTP: ' + error);
            });
    });
  </script>
</body>
</html>