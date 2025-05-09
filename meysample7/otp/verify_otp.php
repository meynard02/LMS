<?php
session_start();
include '../php/connection.php';

// Check if registration is in progress
if (!isset($_SESSION['registration_in_progress']) || !isset($_SESSION['register_email'])) {
    header("Location: ../login/index.php");
    exit();
}

$email = $_SESSION['register_email'];
$error = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $otp = $_POST['otp'] ?? '';
    
    if (empty($otp)) {
        $error = "Please enter the OTP";
    } else {
        // Verify OTP against database
        $sql = "SELECT * FROM user WHERE Email = ? AND OTP = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $email, $otp);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // OTP is valid, mark user as verified
            $updateSql = "UPDATE user SET OTP = NULL, is_verified = 1 WHERE Email = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("s", $email);
            $conn->query("UPDATE user SET Status = 'Active', is_verified = 1 WHERE Email = '$email'");
            
            if ($updateStmt->execute()) {
                // Clear session and redirect
                unset($_SESSION['registration_in_progress']);
                unset($_SESSION['register_email']);
                $_SESSION['registration_verified'] = true;
                header("Location: verify_otp.php?verified=1");
                exit();
            } else {
                $error = "Error updating verification status";
            }
        } else {
            $error = "Invalid OTP. Please try again.";
        }
    }
}

// Cleanup only expired OTPs (older than 1 hour)
$cleanupSql = "DELETE FROM user WHERE OTP IS NOT NULL AND is_verified = 0  AND created_at < NOW() - INTERVAL 1 HOUR";
$conn->query($cleanupSql);
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
    <form id="otp-form" method="POST" action="verify_otp.php">
      <h1>VERIFY YOUR EMAIL</h1>
      
      <?php if (!empty($error)): ?>
        <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>
      
      <div class="input-box">
        <input type="text" name="otp" id="otp" placeholder="Enter 6-digit OTP" required maxlength="6" pattern="\d{6}">
        <i class='bx bxs-lock-alt' aria-label="OTP Icon"></i>
      </div>
      
      <button type="submit" class="btn">Verify</button>

      <div class="resend-info">
        <p>We've sent a 6-digit code to your email. <a href="#" id="resend-otp">Resend OTP</a></p>
      </div>

    </form>
  </div>
  
  <script src="../otp/verify_otp.js"></script>
</body>
</html>