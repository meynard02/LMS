<?php
session_start();
include '../php/connection.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';

$conn->query("DELETE FROM user WHERE `is_verified` = 0 AND created_at < NOW() - INTERVAL 1 HOUR");

$emailError = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $firstname = $_POST['fullname'];
    $lastname = $_POST['lastname'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm-password'];

    // Validate email domain
    if (!str_ends_with($email, '@spist.edu.ph')) {
        $emailError = 'Only @spist.edu.ph emails are allowed';
    }
    // Validate password strength
    else if (strlen($password) < 8) {
        $emailError = 'Password must be at least 8 characters long';
    }
    else if (!preg_match('/[A-Z]/', $password)) {
        $emailError = 'Password must contain at least one uppercase letter';
    }
    else if (!preg_match('/[a-z]/', $password)) {
        $emailError = 'Password must contain at least one lowercase letter';
    }
    else if (!preg_match('/[0-9]/', $password)) {
        $emailError = 'Password must contain at least one number';
    }
    else if (!preg_match('/[\W_]/', $password)) {
        $emailError = 'Password must contain at least one special character';
    }
    // Check if passwords match
    else if ($password !== $confirm_password) {
        $emailError = 'Passwords do not match';
    }
    // Check if email already exists
    else {
        $sql = "SELECT Email FROM user WHERE Email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $emailError = 'This email is already registered';
        } else {
            // Generate OTP
            $otp = rand(100000, 999999);
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            // Store in session
            $_SESSION['registration_in_progress'] = true;
            $_SESSION['register_email'] = $email;
            $_SESSION['register_data'] = [
                'firstname' => $firstname,
                'lastname' => $lastname,
                'password' => $hashedPassword
            ];

            // Insert with OTP and status as 'active'
            $sql = "INSERT INTO user (FirstName, LastName, Email, Password, OTP, Status) 
                    VALUES (?, ?, ?, ?, ?, 'Pending')";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssss", $firstname, $lastname, $email, $hashedPassword, $otp);

            if ($stmt->execute()) {
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

                    $mail->setFrom('spistlms@gmail.com', 'OTP Email Service');
                    $mail->addAddress($email);
                    $mail->isHTML(true);
                    $mail->Subject = 'Your OTP Code';
                    $mail->Body = "<p>Hi $firstname,<br>Your OTP code is <strong>$otp</strong>.</p>";

                    $mail->send();
                    header("Location: ../otp/verify_otp.php");
                    exit();
                } catch (Exception $e) {
                    $emailError = 'OTP could not be sent. Please try again.';
                }
            } else {
                $emailError = 'Registration failed. Please try again.';
            }
        }
        $stmt->close();
    }
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
    <input type="email" name="email" id="email" placeholder="Email (@spist.edu.ph)" required 
           value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
    <i class='bx bxs-envelope' aria-label="Email Icon"></i>
    </div>
        
          <?php if (!empty($emailError)): ?>
                <div class="error-message" style="color: red; margin-top: -20px; margin-bottom: 20px;">
                <?php echo $emailError; ?>
                </div>
          <?php endif; ?>
      
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