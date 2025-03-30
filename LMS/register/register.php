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
    <form id="register-form" onsubmit="return register()">
      <h1>CREATE YOUR ACCOUNT</h1>
      
      <div class="input-box">
        <input type="text" id="fullname" placeholder="First Name" required>
        <i class='bx bxs-user' aria-label="Full Name Icon"></i>
      </div>
      
      <div class="input-box">
        <input type="text" id="lastname" placeholder="Last Name" required>
        <i class='bx bxs-user' aria-label="Full Name Icon"></i>
      </div>
      
      <div class="input-box">
        <input type="email" id="email" placeholder="Email (@spist.edu.ph)" required>
        <i class='bx bxs-envelope' aria-label="Email Icon"></i>
        <small id="emailError" class="error-message" style="display:none; color:red;">Only @spist.edu.ph emails are allowed</small>
      </div>
      
      <div class="input-box">
        <input type="password" id="password" placeholder="Password" required>
        <i class='bx bx-hide' id="togglePassword" aria-label="Toggle Password Visibility"></i>
      </div>
      
      <div class="input-box">
        <input type="password" id="confirm-password" placeholder="Confirm Password" required>
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