<?php
session_start();
include '../php/connection.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';

// Cleanup unverified users older than 1 hour
$conn->query("DELETE FROM user WHERE is_verified = 0 AND created_at < NOW() - INTERVAL 1 HOUR");

// Fetch contact info
$contactStmt = $conn->prepare("SELECT ContactEmail, ContactTelephone FROM contact_info LIMIT 1");
$contactStmt->execute();
$contactResult = $contactStmt->get_result();
$contactInfo = $contactResult->fetch_assoc();

$contactEmail = $contactInfo['ContactEmail'] ?? 'support@example.com';
$contactPhone = $contactInfo['ContactTelephone'] ?? '(123) 456-7890';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $email = $_POST['email'] ?? $username;

    // Check if user is locked out
    if (isset($_SESSION['login_attempts']) && $_SESSION['login_attempts'] >= 5) {
        if (isset($_SESSION['lockout_time']) && (time() - $_SESSION['lockout_time']) < 30) {
            header("Location: ../login/index.php?error=" . urlencode("Account is temporarily locked. Please try again later."));
            exit();
        } else {
            // Reset attempts if lockout period has passed
            $_SESSION['login_attempts'] = 0;
            unset($_SESSION['lockout_time']);
        }
    }

    // Check if this is OTP verification step
    if (isset($_POST['otp'])) {
        $otp = $_POST['otp'];
        $user_id = $_SESSION['temp_user_id'] ?? 0;
        
        // Verify OTP
        $stmt = $conn->prepare("SELECT UserID FROM user WHERE UserID = ? AND OTP = ?");
        $stmt->bind_param("is", $user_id, $otp);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows === 1) {
            // OTP is valid, clear OTP and log user in
            $conn->query("UPDATE user SET OTP = NULL WHERE UserID = $user_id");
            
            $_SESSION['user_id'] = $user_id;
            unset($_SESSION['temp_user_id']);
            unset($_SESSION['otp_verification']);
            
            header("Location: ../user/user.php");
            exit();
        } else {
            header("Location: ../login/login_otp.php?error=" . urlencode("Invalid OTP. Please try again."));
            exit();
        }
    }

    // Check for unverified user (original registration OTP)
    $stmt = $conn->prepare("SELECT UserID FROM user WHERE (Email = ? OR FirstName = ?) AND `is_verified` = 0");
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();

    if ($stmt->get_result()->num_rows > 0) {
        $deleteStmt = $conn->prepare("DELETE FROM user WHERE (Email = ? OR FirstName = ?) AND `is_verified` = 0");
        $deleteStmt->bind_param("ss", $email, $username);
        $deleteStmt->execute();
        header("Location: ../login/index.php?error=" . urlencode("Your previous registration wasn't completed. Please register again."));
        exit();
    }

    // Check admin table
    $adminStmt = $conn->prepare("SELECT AdminID AS id, AdminPassword AS password, AdminFName, AdminLName, Status, AdminEmail FROM admin WHERE AdminUsername = ?");
    $adminStmt->bind_param("s", $username);
    $adminStmt->execute();
    $adminResult = $adminStmt->get_result();

    if ($adminResult->num_rows === 1) {
        $adminRow = $adminResult->fetch_assoc();
        if (password_verify($password, $adminRow['password'])) {
            // Check if admin is inactive
            if ($adminRow['Status'] === 'Inactive') {
                $errorMessage = "Your account is currently inactive.\nPlease contact us:\n\nEmail: $contactEmail\nPhone: $contactPhone";
                header("Location: ../login/index.php?error=" . urlencode($errorMessage));
                exit();
            }
            
            // Generate and send OTP
            $otp = rand(100000, 999999);
            $conn->query("UPDATE admin SET AdminOTP = '$otp' WHERE AdminID = {$adminRow['id']}");
            
            // Store admin ID in session for verification
            $_SESSION['temp_admin_id'] = $adminRow['id'];
            $_SESSION['admin_otp_verification'] = true;
            $_SESSION['admin_email'] = $adminRow['AdminEmail'];
            $_SESSION['admin_fname'] = $adminRow['AdminFName'];
            
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

                $mail->setFrom('spistlms@gmail.com', 'Admin OTP Verification');
                $mail->addAddress($adminRow['AdminEmail']);
                $mail->isHTML(true);
                $mail->Subject = 'Your Admin Login OTP Code';
                $mail->Body = "<p>Hi {$adminRow['AdminFName']},<br>Your admin login OTP code is <strong>$otp</strong>.</p>";

                $mail->send();
                header("Location: ../login/admin_login_otp.php");
                exit();
            } catch (Exception $e) {
                header("Location: ../login/index.php?error=" . urlencode("OTP could not be sent. Please try again."));
                exit();
            }
        }
    }

    // Check user table
    $userStmt = $conn->prepare("SELECT UserID AS id, Password AS password, FirstName, Email, Status FROM user WHERE (Email = ? OR FirstName = ?) AND `is_verified` = 1");
    $userStmt->bind_param("ss", $username, $username);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 1) {
        $userRow = $userResult->fetch_assoc();
        if (password_verify($password, $userRow['password'])) {
            // Check if user is suspended
            if ($userRow['Status'] === 'Suspended') {
                $errorMessage = "Your account has been suspended.\nPlease contact us:\n\nEmail: $contactEmail\nPhone: $contactPhone";
                header("Location: ../login/index.php?error=" . urlencode($errorMessage));
                exit();
            }
            
            // Generate and send OTP
            $otp = rand(100000, 999999);
            $conn->query("UPDATE user SET OTP = '$otp' WHERE UserID = {$userRow['id']}");
            
            // Store user ID in session for verification
            $_SESSION['temp_user_id'] = $userRow['id'];
            $_SESSION['otp_verification'] = true;
            
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

                $mail->setFrom('spistlms@gmail.com', 'OTP Verification');
                $mail->addAddress($userRow['Email']);
                $mail->isHTML(true);
                $mail->Subject = 'Your Login OTP Code';
                $mail->Body = "<p>Hi {$userRow['FirstName']},<br>Your login OTP code is <strong>$otp</strong>.</p>";

                $mail->send();
                header("Location: ../login/login_otp.php");
                exit();
            } catch (Exception $e) {
                header("Location: ../login/index.php?error=" . urlencode("OTP could not be sent. Please try again."));
                exit();
            }
        }
    }

    // If login fails, increment attempt counter
    if (!password_verify($password, $userRow['password'])) {
        $_SESSION['login_attempts'] = ($_SESSION['login_attempts'] ?? 0) + 1;
        
        if ($_SESSION['login_attempts'] >= 5) {
            $_SESSION['lockout_time'] = time();
            header("Location: ../login/index.php?error=" . urlencode("Too many failed attempts. Account locked for 30 seconds."));
            exit();
        }
        
        header("Location: ../login/index.php?error=" . urlencode("Invalid username or password. Please try again."));
        exit();
    }

    // Reset attempts on successful login
    unset($_SESSION['login_attempts']);
    unset($_SESSION['lockout_time']);

    // If no matches found
    header("Location: ../login/index.php?error=" . urlencode("Invalid username or password. Please try again."));
    exit();
}
?>
