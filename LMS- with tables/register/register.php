<?php
session_start(); // Start session at the top
include '../php/connection.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $firstname = $_POST['fullname'];
    $lastname = $_POST['lastname'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm-password'];

    // Validate email domain
    if (!str_ends_with($email, '@spist.edu.ph')) {
        echo "<script>alert('Only @spist.edu.ph emails are allowed.'); window.location.href='register.php';</script>";
        exit();
    }

    // Check if passwords match
    if ($password !== $confirm_password) {
        echo "<script>alert('Passwords do not match. Please try again.'); window.location.href='register.php';</script>";
        exit();
    }

    // Check if email exists and is already verified
    $sql = "SELECT Email FROM user WHERE Email = ? AND is_verified = 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "<script>alert('This email is already registered and verified.'); window.location.href='register.php';</script>";
        exit();
    }

    // Generate OTP
    $otp = rand(100000, 999999);
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Store email in session for verification
    $_SESSION['register_email'] = $email;
    $_SESSION['register_data'] = [
        'firstname' => $firstname,
        'lastname' => $lastname,
        'password' => $hashedPassword
    ];

    // Insert/update temporary registration with OTP
    $sql = "INSERT INTO user (Firstname, Lastname, Email, Password, OTP, is_verified) 
            VALUES (?, ?, ?, ?, ?, 0)
            ON DUPLICATE KEY UPDATE 
            Firstname = VALUES(Firstname), 
            Lastname = VALUES(Lastname), 
            Password = VALUES(Password), 
            OTP = VALUES(OTP), 
            is_verified = 0";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $firstname, $lastname, $email, $hashedPassword, $otp);

    if ($stmt->execute()) {
        // Send OTP via email
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
            $mail->Subject = 'Your OTP Code';
            $mail->Body = "<p>Hi $firstname,<br>Your OTP code is <strong>$otp</strong>. Enter this code to complete your registration.</p>";

            $mail->send();
            header("Location: ../otp/verify_otp.php");
            exit();
        } catch (Exception $e) {
            echo "<script>alert('Error: OTP could not be sent. Mailer Error: {$mail->ErrorInfo}');</script>";
        }
    } else {
        echo "<script>alert('Error: Could not process registration. Please try again.');</script>";
    }
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register Form</title>
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
    <form id="register-form" method="POST" action="register.php">
      <h1>CREATE YOUR ACCOUNT</h1>
      
      <?php if (!empty($error)): ?>
        <p style="color: red;"><?= $error ?></p>
      <?php endif; ?>
      
      <div class="input-box">
        <input type="text" name="fullname" id="fullname" placeholder="First Name" required>
        <i class='bx bxs-user' aria-label="Full Name Icon"></i>
      </div>
      
      <div class="input-box">
        <input type="text" name="lastname" id="lastname" placeholder="Last Name" required>
        <i class='bx bxs-user' aria-label="Full Name Icon"></i>
      </div>
      
      <div class="input-box">
        <input type="email" name="email" id="email" placeholder="Email (@spist.edu.ph)" required>
        <i class='bx bxs-envelope' aria-label="Email Icon"></i>
      </div>
      
      <div class="input-box">
        <input type="password" name="password" id="password" placeholder="Password" required>
        <i class='bx bx-hide' id="togglePassword" aria-label="Toggle Password Visibility"></i>
      </div>
      
      <div class="input-box">
        <input type="password" name="confirm-password" id="confirm-password" placeholder="Confirm Password" required>
        <i class='bx bx-hide' id="toggleConfirmPassword" aria-label="Toggle Password Visibility"></i>
      </div>
      
      <div class="terms">
        <label><input type="checkbox" required> I agree to the terms and conditions</label>
      </div>
      
      <button type="submit" class="btn">Register</button>
      
      <div class="login-link">
        <p>Already have an account? <a href="../login/index.php">Login</a></p>
      </div>
    </form>
  </div>
  <script src="../register/register.js"></script>
</body>
</html>